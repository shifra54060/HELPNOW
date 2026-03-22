require('dotenv').config();
    const cors = require('cors');
const path = require("path");
const express = require('express');
const areaRouter = require('./api/router/areas.router.js');
const requestRouter = require('./api/router/requests.router.js');
const volunteerRouter = require('./api/router/volunteers.router.js');

const app = express();

const host = process.env.HOST

const port = process.env.PORT


// הוספה בשביל הפרונט- גישה
app.use(cors());

app.use(express.json());

// 1. הגדרת תיקיית הפרונט (יוצאים מ-api ונכנסים ל-front)
app.use(express.static(path.join(__dirname, 'client')));

// 2. שליחת קובץ ה-index.html בכתובת הראשית
app.get('/', (req, res) => {
    // חשוב להשתמש ב-'..' כדי לצאת מתיקיית ה-api שבה נמצא הקוד הזה
    const indexPath = path.join(__dirname, 'client', 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(500).send("קובץ ה-HTML לא נמצא במיקום המצופה");
        }
    });
});

app.use(express.json());
app.use('/api/volunteers', volunteerRouter);
app.use('/api/requests', requestRouter);
app.use('/api/areas', areaRouter);



app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.stack);
    res.status(statusCode).json({
        message: err.message || "שגיאה פנימית בשרת"
    })
});

app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});