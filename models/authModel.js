const { Pool } = require('pg');

async function registerAccount(first_name, last_name, email, password) {
  const sql = `
    INSERT INTO account (first_name, last_name, email, password, account_type)
    VALUES ($1, $2, $3, $4, 'Client')
    RETURNING account_id, first_name, last_name, email, account_type
  `
  try {
    const result = await pool.query(sql, [first_name, last_name, email, password])
    return result.rows[0]
  } catch (error) {
    throw new Error(error.message)
  }
}

async function checkExistingEmail(email) {
  const sql = "SELECT 1 FROM account WHERE email = $1"
  try {
    const result = await pool.query(sql, [email])
    return result.rowCount > 0
  } catch (error) {
    throw new Error(error.message)
  }
}

async function getAccountByEmail(email) {
  const sql = `
    SELECT account_id, first_name, last_name, email, account_type, password
    FROM account WHERE email = $1
  `
  try {
    const result = await pool.query(sql, [email])
    return result.rows[0] || null
  } catch (error) {
    throw new Error("No matching email found")
  }
}

async function getAccountById(account_id) {
  const sql = `
    SELECT account_id, first_name, last_name, email, account_type
    FROM account WHERE account_id = $1
  `
  try {
    const result = await pool.query(sql, [account_id])
    return result.rows[0] || null
  } catch (error) {
    throw new Error("No matching account found")
  }
}

async function updateAccountInfo(account_id, first_name, last_name, email, account_type = 'Client') {
  const sql = `
    UPDATE account
    SET first_name = $1, last_name = $2, email = $3, account_type = $4
    WHERE account_id = $5
    RETURNING account_id, first_name, last_name, email, account_type
  `
  try {
    const result = await pool.query(sql, [first_name, last_name, email, account_type, account_id])
    return result.rows[0]
  } catch (error) {
    throw new Error(error.message)
  }
}

async function updateAccountPassword(account_id, password) {
  const sql = `
    UPDATE account SET password = $1 WHERE account_id = $2 RETURNING account_id
  `
  try {
    const result = await pool.query(sql, [password, account_id])
    return result.rows[0]
  } catch (error) {
    throw new Error(error.message)
  }
}

async function getAllAccounts() {
  const sql = `
    SELECT account_id, first_name, last_name, email, account_type FROM account
  `
  try {
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    throw new Error(error.message)
  }
}

async function getAccountTypes() {
  const sql = `
    SELECT DISTINCT account_type FROM account
  `
  try {
    const result = await pool.query(sql)
    return result.rows.map(row => row.account_type)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccountInfo,
  updateAccountPassword,
  getAllAccounts,
  getAccountTypes
}
