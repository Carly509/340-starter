const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorTestController');

router.get('/', errorController.triggerError);

module.exports = router;
