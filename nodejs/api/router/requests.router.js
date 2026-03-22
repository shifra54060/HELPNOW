const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.controller');

router.get('/',requestController.getAll);

router.get('/:id', requestController.getById);

router.put('/:id/assign', requestController.assignVolunteer);

module.exports = router;