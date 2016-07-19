/*
 * @author David Menger
 */
'use strict';

const EnsureIndex = require('../lib/EnsureIndex');
const CollectionMock = require('./CollectionMock');
const assert = require('assert');

describe('EnsureIndex', function () {


    describe('#_createName()', function () {

        it('should return name from options', function () {
            const i = new EnsureIndex();
            assert.equal(i._createName({ index: 1 }, { name: 'foo' }), 'foo');
        });

        it('should make nice name from index', function () {
            const i = new EnsureIndex();

            assert.equal(i._createName({ index: '2d' }), 'index_2d');
            assert.equal(i._createName({ index: '2d', another: -1 }), 'index_2d_another_-1');
        });

    });


    describe('#index()', function () {

        it('should return this', function () {
            const instance = new EnsureIndex(null);
            const ret = instance.index({ test: 1 });

            assert.strictEqual(ret, instance);
        });

    });


    describe('#writeIndexes()', function (done) {

        it('should write nonexisting indexes', function () {
            const collection = new CollectionMock('name', []);
            const instance = new EnsureIndex(collection);

            const write = { definition: { test: 1 }, options: { unique: 1 } };

            instance.index(write.definition, write.options)
                .writeIndexes()
                .then(() => {
                    assert.deepEqual(collection.createdIndexes, [
                        write
                    ]);
                    assert.deepEqual(collection.droppedIndexes, []);
                })
                .then(done);
        });

        it('should remove no longer needed indexes', function () {
            const collection = new CollectionMock('name', [
                'toRemove_1'
            ]);
            const instance = new EnsureIndex(collection);

            const write = { definition: { test: 1 }, options: { unique: 1 } };

            instance.index(write.definition, write.options)
                .writeIndexes()
                .then(() => {
                    assert.deepEqual(collection.createdIndexes, [
                        write
                    ]);
                    assert.deepEqual(collection.droppedIndexes, [
                        'toRemove_1'
                    ]);
                })
                .then(done);
        });

    });


});
