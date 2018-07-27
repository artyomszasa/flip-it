module.exports = class {
    constructor (idProperty) {
        this.__data = {};
        this.__idProperty = idProperty || 'id';
    }
    get items () { return Promise.resolve(Object.values(this.__data)); }
    lookup (id) { return Promise.resolve(this.__data[id] || null); }
    upsert (item) {
        this.__data[item[this.__idProperty]] = item;
        return Promise.resolve();
    }
};