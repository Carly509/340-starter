const pool = require('./db');

module.exports = {
  async findByEmail(email) {
    const query = 'SELECT * FROM account WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  async addUser(user) {
    const query = `
      INSERT INTO account (first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [user.firstName, user.lastName, user.email, user.password];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getAccountById(id) {
    const query = 'SELECT * FROM account WHERE account_id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async getAccountByEmail(email) {
    const query = 'SELECT * FROM account WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  async updateAccountInfo({ account_id, firstName, lastName, email }) {
    const query = `
      UPDATE account
      SET first_name = $1, last_name = $2, email = $3
      WHERE account_id = $4`;
    const values = [firstName, lastName, email, account_id];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
  },

  async updatePassword(account_id, hashedPassword) {
    const query = `
      UPDATE account
      SET password = $1
      WHERE account_id = $2`;
    const values = [hashedPassword, account_id];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
  }
};
