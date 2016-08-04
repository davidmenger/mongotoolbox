/*
 * @author David Menger
 */
'use strict';

const promiseAll = require('../lib/promiseAll');
const assert = require('assert');

describe('promiseAll()', function () {

    it('should return promise, which will be resolved after all', function (done) {
        const one = new Promise((resolve) => resolve(1));
        const two = new Promise((resolve) => resolve(2));

        promiseAll([one, two])
            .then((result) => {
                assert.deepEqual(result, [1, 2]);
                done();
            })
            .catch((err) => {
                throw err;
            });
    });

    it('should throw an error, when promise is rejected', function (done) {
        const rightResult = new Error();

        const one = new Promise((resolve) => resolve(1));
        const two = new Promise((resolve, reject) => reject(rightResult));

        promiseAll([one, two])
            .then(() => {
                assert.fail('Then callback should not be called');
            })
            .catch((err) => {
                assert.strictEqual(err, rightResult);
                done();
            });
    });


    it('should return resolved promise, when using empty array', function (done) {
        promiseAll([])
            .then(() => done());
    });


});
