const autoBind = require('auto-bind');

class Controller {
    constructor(service) {
        this.service = service;
        autoBind(this);
    }

    async getAll(req, res, next) {
        try {
            const result = await this.service.getAll(req.query);
            return res.status(result.statusCode).json(result);
        } catch (err) {
            next(err);
        }
    }

    async getById(req, res, next) {
        try {
            //  req.params.id קיצור של 
            const { id } = req.params;
            const result = await this.service.getById(id);


            return res.status(result.statusCode).json(result);
        }

        catch (err) {
            next(err);
        }

    }

    async findOne(req, res, next) {
        const code = req.body
        try {
            const result = await this.service.findOne(code)
            return res.status(result.statusCode).json(result)
        }
        catch (err) {
            next(err);
        }
    }


    async update(req, res, next) {
        try {
            const { id } = req.params;
            const data = req.body;
            const response = await this.service.update(id, data);

            return res.status(response.statusCode).json(response);
        }
        catch (err) {
            next(err);
        }
    }


    async create(req, res, next) {
        try {
            const data = req.body;
            const response = await this.service.create(data);
            return res.status(response.statusCode).json(response);
        }
        catch (err) {
            next(err);
        }

    }

}
module.exports = Controller;