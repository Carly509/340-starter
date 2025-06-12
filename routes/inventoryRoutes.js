const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const validation = require('../middleware/validation');
const authenticateToken = require('../middleware/authMiddleware');


router.get('/', authenticateToken, inventoryController.showManagement);

router.get('/add-classification', authenticateToken, inventoryController.showAddClassification);
router.post('/add-classification', authenticateToken, validation.validateClassification, inventoryController.addClassification);

router.get('/add-inventory', authenticateToken, inventoryController.showAddInventory);
router.post('/add-inventory', authenticateToken, validation.validateInventory, inventoryController.addInventory);

router.get('/classification/:classificationName', inventoryController.getVehiclesByClassification);
router.get('/detail/:id', inventoryController.detail);

module.exports = router;
