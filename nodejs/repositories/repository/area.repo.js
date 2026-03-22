const Repository = require('./Repository.js');
const area = require('../../models/area.model.js');
class areaRepo extends Repository {
    constructor() {
        super(area);
    }
}
module.exports = new areaRepo();