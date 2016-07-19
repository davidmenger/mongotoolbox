/*
 * @author David Menger
 */
'use strict';

function promiseAll (arrayOfPromises) {
    const promises = arrayOfPromises.slice();
    const result = [];
    let unresolved = promises.length;
    result.length = unresolved;
    result.fill(null);

    return new Promise((resolve, reject) => {
        promises.forEach((promise) => {
            promise.then((res) => {
                const index = promises.indexOf(promise);
                result[index] = res;
                unresolved--;
                if (unresolved === 0) {
                    resolve(result);
                }
            })
            .catch((err) => {
                if (unresolved > 0) {
                    unresolved = -1;
                    reject(err);
                }
            });
        });
    });
}

module.exports = promiseAll;
