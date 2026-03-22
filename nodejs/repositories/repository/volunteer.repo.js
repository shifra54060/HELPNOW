const Repository = require('./Repository.js');
const volunteer = require('../../models/volunteer.model.js');
class VolunteerRepo extends Repository {
    constructor() {
        super(volunteer);
    }
}
module.exports = new VolunteerRepo();