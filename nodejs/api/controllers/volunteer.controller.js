const Controller = require('./Controller.js');
const volunteerService = require('../../services/volunteer.service.js');


class VolunteersController extends Controller {
    constructor() {
        super(volunteerService)
    }
}

module.exports = new VolunteersController();