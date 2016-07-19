/*
 * @author David Menger
 */
'use strict';

class CollectionMock {

    constructor (collectionName, existingIndexesNames) {
        this._collectionName = collectionName;

        this._droppedIndexes = [];

        this._createdIndexes = [];

        this._existingIndexes = existingIndexesNames
            .map((name) => ({ name }));
    }

    get collectionName () {
        return this._collectionName;
    }

    get droppedIndexes () {
        return this._droppedIndexes;
    }

    get createdIndexes () {
        return this._createdIndexes;
    }

    indexes () {
        return Promise.resolve(this._existingIndexes);
    }

    createIndex (definition, options) {
        this._createdIndexes.push({ definition, options });
        return Promise.resolve();
    }

    dropIndex (name) {
        this._droppedIndexes.push(name);
        return Promise.resolve();
    }

}

module.exports = CollectionMock;
