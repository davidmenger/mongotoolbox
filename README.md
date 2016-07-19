# Mongotools

MongoDB toolbox for index management and simple connection to authorized database

------------

# Using

This utility requires:

- Node.js `>= 6.0.0`
- mongodb driver `^2.2.4`

Install package with npm:

```
npm i -S mongotools
```

Ensure indexes at collection

```javascript
const mongotools = require('mongotools');

mongotools.ensureIndex(db.collection('myCollection'))
    .index({ someUniqueIndex: 1 }, { sparse: true, unique: true })
    .writeIndexes();
```

Connect to database

```javascript

const mongotools = require('mongotools');

mongotools.connectAndAuth('mongodb://localhost:27017')
    .then((db) => {
        // use connected db object
    });
```


Connect to database and authenticate

```javascript

const mongotools = require('mongotools');

const url = 'mongodb://localhost:27017';
const options = { user: 'username', password: 'foo' };

mongotools
    .connectAndAuth(url, options)
    .then((db) => {
        // use connected db object
    });
```

------------

# API

## connectAndAuth(url: string, options: object)
    + `url`:  mongodb connection string
    + `options` options for mongodb connect method
        + `options.user`: username for authentication
        + `options.password`: password for authentication

## EnsureIndex class

- **new EnsureIndex(mongoDbCollection)**
    + creates instance of mongodb collection

- **index(definition: string, options: object)**
    + `definition`: object accepted by mongo
    + `options`: object accepted by mongo

- **writeIndexes()**
    + removes unwanted indexes and writes non-existing ones