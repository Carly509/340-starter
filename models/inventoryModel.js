const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || 'your_db_user',
  password: process.env.PGPASSWORD || 'your_db_password',
  database: process.env.PGDATABASE || 'your_db_name',
  ssl: { rejectUnauthorized: false }
});

exports.getVehicleById = async (id) => {
  const query = `
    SELECT
      inv_make AS make,
      inv_model AS model,
      inv_year AS year,
      inv_description AS description,
      inv_image AS image,
      inv_thumbnail AS thumbnail,
      inv_price AS price,
      inv_miles AS miles,
      inv_color AS color,
      classification_id
    FROM inventory
    WHERE inventory_id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

exports.getVehiclesByClassification = async (classificationName) => {
  const query = `
    SELECT
      i.inventory_id AS inventory_id,
      i.inv_make AS make,
      i.inv_model AS model,
      i.inv_year AS year,
      i.inv_description AS description,
      i.inv_image AS image,
      i.inv_thumbnail AS thumbnail,
      i.inv_price AS price,
      i.inv_miles AS miles,
      i.inv_color AS color,
      c.classification_name
    FROM inventory i
    INNER JOIN classification c ON i.classification_id = c.classification_id
    WHERE c.classification_name = $1
  `;
  const { rows } = await pool.query(query, [classificationName]);
  return rows;
};
