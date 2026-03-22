const Service = require('./Service.js');
const repo = require('../repositories/repository/request.repo.js')
const volunteerRepo = require('../repositories/repository/volunteer.repo.js')
class RequestService extends Service {
    constructor() {
        super(repo);
        this.volunteerRepo = volunteerRepo
    }
    async getAll(query) {
        const filters = {}
        if (query['location.areaCode'])
            filters['location.areaCode'] = query['location.areaCode'];
        if (query.status) filters.status = query.status;
        if (query.priority) filters.priority = query.priority;
        return super.getAll(filters)
    }

    async assignVolunteerToRequest(requestId, volunteerCode, newStatus) {
        const volunteer = await this.volunteerRepo.findOne({ volunteerCode: volunteerCode });
        //האם המתנדב קיים
        if (!volunteer) {
            const error = new Error("the volunteer not found");
            error.statusCode = 404;
            throw error;
        }
        //---------------------------- הוספתי זה בשביל לסדר שאם בכלל הבקשה לא קיימת שגיאה 
        // וכדי שרק מי שלקח את הבקשה יכול לסיים אותה אז לבדוק שהקוד מתנדב בבקשה כמו הקוד שמכניסים עכשיו כדי ללעדכן\ לסיים
        // האם הבקשה קיימת
        const currentRequest = await this.repo.getById(requestId);
        if (!currentRequest) {
            const error = new Error("request not found");
            error.statusCode = 404;
            throw error;
        }

        // 3.   אם הסטטוס הוא 'הסתיים', נוודא שזה אותו מתנדב
        if (newStatus === 'הסתיים') {
            if (currentRequest.volunteerCode !== volunteerCode) {
                const error = new Error("Only the volunteer associated with the request can complete it.");
                error.statusCode = 403;
                throw error;
            }
        }
        const data = {
            volunteerCode: volunteerCode,
            status: newStatus
        }

        const requestUpdate = await this.repo.update(requestId, data)
        return requestUpdate
    }
}

module.exports = new RequestService();