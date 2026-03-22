class HttpResponse {
    /**
     * @param {any} data - הנתונים שחוזרים מה-DB (אובייקט או מערך)
     * @param {Object} options - הגדרות נוספות (סטטוס, הודעה, וכו')
     */
    constructor(data, options = {}) {
        // הנתונים עצמם
        this.data = data;

        // קוד סטטוס (ברירת מחדל 200 אם לא נשלח אחרת)
        this.statusCode = options.statusCode || 200;

        // הודעה ידידותית למשתמש
        this.message = options.message || 'הפעולה הסתיימה בהצלחה';

        // טיפול במקרים של מחיקה
        if (options.deleted) {
            this.deleted = true;
        }

        // טיפול בכמות תוצאות (שימושי ב-getAll עם פגינציה)
        if (options.totalCount !== undefined) {
            this.totalCount = options.totalCount;
        }

        // אפשרות להוסיף שגיאות מפורטות אם יש (אופציונלי)
        if (options.errors) {
            this.errors = options.errors;
        }
    }
}

module.exports = { HttpResponse };