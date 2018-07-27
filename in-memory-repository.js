module.exports = class {
    constructor (idProperty) {
        this.__data = {};
        this.__idProperty = idProperty || 'id';
    }
    get items () { return Object.values(this.__data); }
    lookup (id) { return this.__data[id]; }
    upsert (item) { return this.__data[item[this.__idProperty]] = item; }
};