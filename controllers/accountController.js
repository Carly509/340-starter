const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const accountModel = require('../models/accountModel');

exports.getRegister = (req, res) => {
  res.render('register', { message: null });
};

exports.register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.render('register', { message: 'All fields are required.' });
  }
  const existing = await accountModel.findByEmail(email);
  if (existing) {
    return res.render('register', { message: 'Email already registered.' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { email, password: hashedPassword, firstName, lastName, accountType: 'Client', id: Date.now() };
  await accountModel.addUser(user);
  res.render('login', { message: 'Registration successful. Please log in.' });
};

exports.getLogin = (req, res) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        return res.redirect('/inventory');
      }
      res.render('login', { message: null });
    });
  } else {
    res.render('login', { message: null });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await accountModel.findByEmail(email);
  if (!user) {
    return res.render('login', { message: 'Invalid email or password.' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.render('login', { message: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { account_id: user.account_id,
    email: user.email,
    account_type: user.account_type,
    first_name: user.first_name,
    last_name: user.last_name },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.cookie('token', token, { httpOnly: true });
  res.redirect('/inventory');
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};

exports.getUpdateView = async (req, res) => {
  const account = await accountModel.getAccountById(req.user.account_id);
  console.log('Account:', account);
  res.render('account/update', {
    account,
    user: req.user,
    messages: req.flash(),
    errors: []
  });
};

// POST: Update account info
exports.updateAccount = async (req, res) => {
  const errors = validationResult(req);
  console.log('ddd',req.body)
  const account = {
  account_id: req.body.account_id,
  firstName: req.body.firstName,
  lastName: req.body.lastName,
  email: req.body.email
  };

  if (!errors.isEmpty()) {
    return res.render('account/update', {
      account,
      user: req.user,
      messages: req.flash(),
      errors: errors.array()
    });
  }

  const existing = await accountModel.getAccountByEmail(account.email);
  if (existing && existing.account_id != account.account_id) {
    return res.render('account/update', {
      account,
      user: req.user,
      messages: { error: 'Email already in use.' },
      errors: []
    });
  }

  const result = await accountModel.updateAccountInfo(account);
  if (result) {
    req.flash('success', 'Account updated successfully!');
    return res.redirect('/inventory');
  } else {
    req.flash('error', 'Update failed.');
    return res.render('account/update', {
      account,
      user: req.user,
      messages: req.flash(),
      errors: []
    });
  }
};

exports.getChangePasswordView = async (req, res) => {
  const account = await accountModel.getAccountById(req.user.account_id);
  res.render('account/change-password', {
    account,
    user: req.user,
    messages: req.flash(),
    errors: []
  });
};

exports.changePassword = async (req, res) => {
  const errors = validationResult(req);
  const account = await accountModel.getAccountById(req.body.account_id);

  if (!errors.isEmpty()) {
    return res.render('account/change-password', {
      account,
      user: req.user,
      messages: req.flash(),
      errors: errors.array()
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const result = await accountModel.updatePassword(account.account_id, hashedPassword);

  if (result) {
    req.flash('success', 'Password updated successfully!');
    return res.redirect('/inventory');
  } else {
    req.flash('error', 'Password update failed.');
    return res.render('account/change-password', {
      account,
      user: req.user,
      messages: req.flash(),
      errors: []
    });
  }
};
