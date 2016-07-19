/*
 * @author David Menger
 */
'use strict';

const EnsureIndex = require('./lib/EnsureIndex');
const connectAndAuth = require('./lib/connectAndAuth');

/**
 *
 * @param mongoDbCollection (description)
 * @returns {EnsureIndex}
 */
function ensureIndex (mongoDbCollection) {
    return new EnsureIndex(mongoDbCollection);
}

module.exports = {
    ensureIndex,
    connectAndAuth
};
