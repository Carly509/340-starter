const { vehicleSpecsHTML } = require('../views/partials/utilities/index');
const inventoryModel = require('../models/inventoryModel');

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
  try {
    const classificationName = req.params.classificationName;
    const vehicles = await inventoryModel.getVehiclesByClassification(classificationName);
    console.log('Vehicle list:', vehicles);

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
