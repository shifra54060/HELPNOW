const autoBind = require('auto-bind');
const db = require('./dbConnection.js');

class Repository {
    constructor(model) {
        this.model = model;
        autoBind(this);
        db.connect();
    }


    async getAll(query) {

        const item = await this.model.find(query);
        if (item.length === 0) {
            const error = new Error(' item  not found');
            error.statusCode = 404;
            throw error;
        }

        return item;

    }

    async getById(id) {

        const item = await this.model.findById(id);
        if (!item) {
            const error = new Error(' item  not found');
            error.statusCode = 404;
            throw error;
        }

        return item;

    }

    async findOne(query) {
        return await this.model.findOne(query);
    }


    async update(id, data) {

        const item = await this.model.findByIdAndUpdate(id, data, { new: true });
        if (!item) {
            const error = new Error(' item  not found');
            error.statusCode = 404;
            throw error;
        }
        return item;
    }



    async create(data) {

        const item = await this.model.create(data);
        if (item) {
            return item;
        }
        throw new Error('Error creating item');
    }
}

module.exports = Repository;