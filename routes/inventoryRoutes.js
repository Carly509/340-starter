const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const validation = require('../middleware/validation');

// Management view (Task 1)
router.get('/', inventoryController.showManagement);

// Add classification routes (Task 2)
router.get('/add-classification', inventoryController.showAddClassification);
router.post('/add-classification', validation.validateClassification, inventoryController.addClassification);

// Add inventory routes (Task 3)
router.get('/add-inventory', inventoryController.showAddInventory);
router.post('/add-inventory', validation.validateInventory, inventoryController.addInventory);

// Use distinct routes to avoid conflicts
router.get('/classification/:classificationName', inventoryController.getVehiclesByClassification);
router.get('/detail/:id', inventoryController.detail);

module.exports = router;
