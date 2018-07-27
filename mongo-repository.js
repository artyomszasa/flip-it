//NOTE: requires "mongodb": "^3.1.1" in dependencies!

const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb://127.0.0.1:27017" || process.env.MONGODB_URI;

const dbName = 'flip-it' || process.env.MONGODB_DATABASE;

module.exports = class {
    constructor (idProperty, name) {
        this.__idProperty = idProperty || 'id';
        if (!name) {
            throw new TypeError('Collection name must be specified');
        }
        this.__name = name;
    }
    __toDto (entry) {
        const dto = Object.assign({}, entry);
        delete dto._id;
        return dto;
    }
    __fromDto (dto) {
        const entry = Object.assign({}, dto);
        entry._id = entry[this.__idProperty];
        return entry;
    }
    get items () {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, (err, client) => {
                if (err) {
                    reject(err);
                } else {
                    const collection = client.db(dbName).collection(this.__name);
                    collection.find({}).toArray((err, docs) => err ? reject(err) : resolve(docs.map(this.__toDto)));
                }
            });
        });
    }
    lookup (id) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, (err, client) => {
                if (err) {
                    reject(err);
                } else {
                    const collection = client.db(dbName).collection(this.__name);
                    collection.findOne({ _id: id }, (err, doc) => err ? reject(err) : resolve(this.__toDto(doc)));
                }
            });
        });
    }
    upsert (item) {
        const entry = this.__fromDto(item);
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, (err, client) => {
                if (err) {
                    reject(err);
                } else {
                    const collection = client.db(dbName).collection(this.__name);
                    collection.findOne({ _id: entry._id }, (err, e) => {
                        if (err || !e) {
                            collection.insertOne(entry, err => err ? reject(err) : resolve());
                        } else {
                            collection.updateOne({ _id: entry._id }, entry, err => err ? reject(err) : resolve());
                        }
                    });
                }
            });
        });
    }
};