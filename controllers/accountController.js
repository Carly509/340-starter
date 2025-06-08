const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const accountModel = require('../models/accountModel') // Adjust path as needed

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret' // Use env var in production

// Register a new account
async function register(req, res) {
  try {
    const { first_name, last_name, email, password } = req.body
    // Check if email already exists
    if (await accountModel.checkExistingEmail(email)) {
      return res.status(409).json({ message: 'Email already registered' })
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    // Register account
    const account = await accountModel.registerAccount(first_name, last_name, email, hashedPassword)
    // Create JWT
    const token = jwt.sign(
      { account_id: account.account_id, email: account.email, account_type: account.account_type },
      JWT_SECRET,
      { expiresIn: '2h' }
    )
    res.status(201).json({ account, token })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Login
async function login(req, res) {
  try {
    const { email, password } = req.body
    const account = await accountModel.getAccountByEmail(email)
    if (!account) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const valid = await bcrypt.compare(password, account.password)
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    // Create JWT
    const token = jwt.sign(
      { account_id: account.account_id, email: account.email, account_type: account.account_type },
      JWT_SECRET,
      { expiresIn: '2h' }
    )
    // Remove password before sending
    delete account.password
    res.json({ account, token })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get account info (protected)
async function getAccount(req, res) {
  try {
    const { account_id } = req.user // Set by JWT middleware
    const account = await accountModel.getAccountById(account_id)
    if (!account) {
      return res.status(404).json({ message: 'Account not found' })
    }
    res.json(account)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update account info (protected)
async function updateAccount(req, res) {
  try {
    const { account_id } = req.user
    const { first_name, last_name, email, account_type } = req.body
    const updated = await accountModel.updateAccountInfo(account_id, first_name, last_name, email, account_type)
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update password (protected)
async function updatePassword(req, res) {
  try {
    const { account_id } = req.user
    const { password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    await accountModel.updateAccountPassword(account_id, hashedPassword)
    res.json({ message: 'Password updated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  register,
  login,
  getAccount,
  updateAccount,
  updatePassword
}
