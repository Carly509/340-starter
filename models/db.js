const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || 'your_db_user',
  password: process.env.PGPASSWORD || 'your_db_password',
  database: process.env.PGDATABASE || 'your_db_name',
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
