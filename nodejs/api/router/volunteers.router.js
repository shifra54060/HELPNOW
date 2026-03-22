const express = require('express');
const router = express.Router();
const volunteersController = require('../../api/controllers/volunteer.controller.js');
router.post('/', volunteersController.create);
router.get('/', volunteersController.getAll)
module.exports = router;