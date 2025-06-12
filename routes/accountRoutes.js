const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authenticateToken = require('../middleware/authMiddleware');
const { body } = require('express-validator');

router.get('/register', accountController.getRegister);
router.post('/register', accountController.register);
router.get('/login', accountController.getLogin);
router.post('/login', accountController.login);
router.get('/logout', accountController.logout);

router.get('/update', authenticateToken, accountController.getUpdateView);
router.get('/change-password', authenticateToken, accountController.getChangePasswordView);

router.post('/update',
  authenticateToken,
  [
    body('firstName').notEmpty().withMessage('First name required'),
    body('lastName').notEmpty().withMessage('Last name required'),
    body('email').isEmail().withMessage('Valid email required')
  ],
  accountController.updateAccount
);

router.post('/change-password',
  authenticateToken,
  [
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/).withMessage('Must contain an uppercase letter')
      .matches(/[a-z]/).withMessage('Must contain a lowercase letter')
      .matches(/\d/).withMessage('Must contain a number')
  ],
  accountController.changePassword
);

module.exports = router;
