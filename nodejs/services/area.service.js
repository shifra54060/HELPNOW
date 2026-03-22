const Service = require('./Service.js');
const repo = require('../repositories/repository/area.repo.js')
class AreaService extends Service {
    constructor() {
        super(repo);
    }
}

module.exports = new AreaService();