const Controller = require('./Controller.js');
const areaService = require('../../services/area.service.js');

class AreaController extends Controller {
    constructor() {
        super(areaService)
    }
}

module.exports = new AreaController();