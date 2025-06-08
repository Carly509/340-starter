const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/:id', inventoryController.detail);
router.get('/classification/:classificationName', inventoryController.getVehiclesByClassification);

module.exports = router;
