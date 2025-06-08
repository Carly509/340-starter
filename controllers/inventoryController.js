const { vehicleSpecsHTML } = require('../views/partials/utilities/index');
const inventoryModel = require('../models/inventoryModel');
const utilities = require('../views/partials/utilities/classification');
const { validationResult } = require('express-validator');

// Existing functions
exports.detail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const vehicle = await inventoryModel.getVehicleById(id);
    if (!vehicle) return res.status(404).send('Vehicle not found');
    let vehicleSpecs = '';
    try {
      vehicleSpecs = vehicleSpecsHTML(vehicle);
    } catch (utilErr) {
      console.error('vehicleSpecsHTML error:', utilErr);
      vehicleSpecs = '<div>Error loading specs</div>';
    }
    res.render('inventory/detail', { vehicle, vehicleSpecs });
  } catch (err) {
    console.error('Controller error:', err);
    next(err);
  }
};

exports.getVehiclesByClassification = async (req, res) => {
  console.log('inventoryModel:', inventoryModel);
  console.log('getVehiclesByClassification called');
  console.log( 'red', req.params)
  try {
    const classificationName = req.params.classificationName;
    const vehicles = await inventoryModel.getVehiclesByClassification(classificationName);

    if (vehicles.length === 0) {
      return res.status(404).render('inventory/no-vehicles', { classificationName });
    }

    res.render('inventory/vehicle-list', {
      vehicles,
      classificationName
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('inventory/error', { message: 'Server error retrieving vehicles.' });
  }
};

// NEW FUNCTIONS FOR THE TASKS

// Task 1: Show management view
exports.showManagement = async (req, res) => {
  try {
    res.render('inventory/management', {
      title: 'Inventory Management',
      messages: req.flash()
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Task 2: Show add classification form
exports.showAddClassification = async (req, res) => {
  try {
    res.render('inventory/add-classification', {
      title: 'Add New Classification',
      messages: req.flash(),
      errors: null
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Task 2: Process add classification
exports.addClassification = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('inventory/add-classification', {
      title: 'Add New Classification',
      messages: req.flash(),
      errors: errors.array()
    });
  }

  try {
    const { classification_name } = req.body;
    const result = await inventoryModel.addClassification(classification_name);

    if (result) {
      req.flash('success', 'Classification added successfully!');
      // Regenerate navigation to include new classification
      res.locals.nav = await utilities.getNav();
      res.render('inventory/management', {
        title: 'Inventory Management',
        messages: req.flash()
      });
    } else {
      req.flash('error', 'Failed to add classification');
      res.render('inventory/add-classification', {
        title: 'Add New Classification',
        messages: req.flash(),
        errors: null
      });
    }
  } catch (error) {
    console.error(error);
    req.flash('error', 'Database error occurred');
    res.render('inventory/add-classification', {
      title: 'Add New Classification',
      messages: req.flash(),
      errors: null
    });
  }
};

// Task 3: Show add inventory form
exports.showAddInventory = async (req, res) => {
  try {
    const classificationList = await utilities.buildClassificationList();
    res.render('inventory/add-inventory', {
      title: 'Add New Vehicle',
      messages: req.flash(),
      errors: null,
      classificationList
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Task 3: Process add inventory
exports.addInventory = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const classificationList = await utilities.buildClassificationList(req.body.classification_id);
    return res.render('inventory/add-inventory', {
      title: 'Add New Vehicle',
      messages: req.flash(),
      errors: errors.array(),
      classificationList,
      ...req.body // Keep form data sticky
    });
  }

  try {
    const vehicleData = {
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image || '/images/vehicles/no-image.png',
      inv_thumbnail: req.body.inv_thumbnail || '/images/vehicles/no-image-tn.png',
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      classification_id: req.body.classification_id
    };

    const result = await inventoryModel.addVehicle(vehicleData);

    if (result) {
      req.flash('success', 'Vehicle added successfully!');
      res.render('inventory/management', {
        title: 'Inventory Management',
        messages: req.flash()
      });
    } else {
      req.flash('error', 'Failed to add vehicle');
      const classificationList = await utilities.buildClassificationList(req.body.classification_id);
      res.render('inventory/add-inventory', {
        title: 'Add New Vehicle',
        messages: req.flash(),
        errors: null,
        classificationList,
        ...req.body
      });
    }
  } catch (error) {
    console.error(error);
    req.flash('error', 'Database error occurred');
    const classificationList = await utilities.buildClassificationList(req.body.classification_id);
    res.render('inventory/add-inventory', {
      title: 'Add New Vehicle',
      messages: req.flash(),
      errors: null,
      classificationList,
      ...req.body
    });
  }
};
