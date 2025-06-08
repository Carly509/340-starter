// middleware/validation.js
const { body, validationResult } = require('express-validator');

exports.validateInventory = [
  body('inv_make').notEmpty().trim(),
  body('inv_model').notEmpty().trim(),
  // ...other validations...
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('inventory/add-inventory', {
        errors: errors.array(),
        formData: req.body
      });
    }
    next();
  }
];

exports.validateClassification = [
  body('classification_name')
    .trim()
    .notEmpty().withMessage('Classification name is required')
    .isAlphanumeric().withMessage('No spaces or special characters allowed'),
  (req, res, next) => {
    console.log('classification_name:', req.body.classification_name);

    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    res.render('inventory/add-classification', {
      errors: errors.array(),
      formData: req.body
    });
  }
];
