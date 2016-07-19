/*
 * @author David Menger
 */
'use strict';

const promiseAll = require('./promiseAll');

class EnsureIndex {

    constructor (mongodbCollection, logger = null) {
        this._collection = mongodbCollection;
        this._data = new Map();
        this._logger = logger || console;
    }

    index (definition, options = {}) {
        const name = this._createName(definition, options);

        Object.assign(options, {
            background: true
        });

        this._data.set(name, {
            name,
            options,
            definition
        });
        return this;
    }

    _createName (definition, options) {

        if (typeof options === 'object' && options.name) {
            return options.name;
        }

        const indexes = [];
        let keys;

        // Get all the fields accordingly
        if (typeof definition === 'string') {
            // 'type'
            indexes.push(`${definition}_1`);
        } else if (Array.isArray(definition)) {
            definition.forEach((f) => {
                if (typeof f === 'string') {
                    // [{location:'2d'}, 'type']
                    indexes.push(`${f}_1`);
                } else if (Array.isArray(f)) {
                    // [['location', '2d'],['type', 1]]
                    indexes.push(`${f[0]}_${f[1] || 1}`);
                } else if (typeof f === 'object') {
                    // [{location:'2d'}, {type:1}]
                    keys = Object.keys(f);
                    keys.forEach((k) => {
                        indexes.push(`${k}_${f[k]}`);
                    });
                }
            });
        } else if (typeof definition === 'object') {
            // {location:'2d', type:1}
            keys = Object.keys(definition);
            keys.forEach((key) => {
                indexes.push(`${key}_${definition[key]}`);
            });
        }

        let name = indexes.join('_');

        if (typeof options !== 'object') {
            return name;
        } else if (options.unique) {
            name += '_uq';
        }
        if (options.sparse) {
            name += '_sp';
        }
        if (options.expireAfterSeconds) {
            name += '_ex';
        }
        return name;
    }

    /**
     *
     * @returns {<CollectionMock>}
     */
    writeIndexes () {
        return this._collection.indexes()
            .catch((err) => {
                if (err.code === 26) {
                    return [];
                }
                this._logger.warn(
                    `Can't fetch indexes at: ${this._collection.collectionName}`,
                    err
                );
                return true;
            })
            .then((res) => {
                if (res === true) { // 26 = no collection
                    return Promise.resolve();
                }

                const current = this._mapExistingIndexesAndDropUnwanted(res);
                const unresolved = [];

                for (const index of this._data.values()) {
                    if (current.indexOf(index.name) !== -1) {
                        continue;
                    }

                    const promise = this._createIndexWithDefinition(index);
                    unresolved.push(promise);
                }

                return promiseAll(unresolved);
            });
    }

    _createIndexWithDefinition (index) {
        this._logger.info(`Creating index: ${index.name}`);


        return this._collection.createIndex(index.definition, index.options)
            .catch((err) => {
                if (err) {
                    this._logger.warn(`Can't create index: ${index.name}`, err);
                }
                return true;
            });
    }

    _mapExistingIndexesAndDropUnwanted (res) {
        return res.map((index) => {

            if (!index.name.match(/^_id_?$/)
                    && !this._data.has(index.name)) {

                this._logger.info(`Dropping index: ${index.name}`);

                this._collection.dropIndex(index.name)
                    .catch((err) => {
                        if (!err.message.match(/^index not found/)) {
                            this._logger.error(`Can't drop index: ${index.name}`, err);
                        }
                    });
            }
            return index.name;
        }, this);
    }
}

module.exports = EnsureIndex;
