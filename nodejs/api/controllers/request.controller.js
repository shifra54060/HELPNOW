const Controller = require('./Controller.js');
const requestService = require('../../services/request.service.js');


class RequestController extends Controller {
    constructor() {
        super(requestService)
    }



    async assignVolunteer(req, res, next) {
        try {

            const { id } = req.params;

            const { volunteerCode, status } = req.body;

            const result = await requestService.assignVolunteerToRequest(id, volunteerCode, status);


            return res.status(200).json(result);
        } catch (err) {

            next(err);
        }
    }
}


module.exports = new RequestController();