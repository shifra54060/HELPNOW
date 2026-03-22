const express = require('express');
const router = express.Router();
const areasController = require('../controllers/area.controller');


router.get('/', areasController.getAll);

module.exports = router;