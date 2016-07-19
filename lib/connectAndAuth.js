/*
 * @author David Menger
 */
'use strict';

const mongodb = require('mongodb');

/**
 *
 *
 * @param {string} url
 * @param {{ user: string, password: string }} [options]
 * @returns {Promise.<Db>}
 */
function connectAndAuth (url, options = {}) {
    return mongodb.MongoClient
        .connect(url, options)
        .then((db) => {
            if (options && options.user) {
                return db.authenticate(options.user, options.password)
                    .then(() => db);
            }
            return db;
        });
}

module.exports = connectAndAuth;
