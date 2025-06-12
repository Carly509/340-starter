const pool = require('./db');

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
  console.log('getVehicleById query result:', rows);
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

exports.getClassifications = async () => {
  const query = `
    SELECT classification_id, classification_name
    FROM classification
    ORDER BY classification_name
  `;
  const result = await pool.query(query);
  return result;
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const isUniqueKey = async (key) => {
  const query = `
    SELECT COUNT(*) FROM classification WHERE id = $1
  `;
  const result = await pool.query(query, [key]);
  return result.rows[0].count === '0';
};

exports.addClassification = async (classificationName) => {
  let randomKey;
  let unique = false;

  while (!unique) {
    randomKey = getRandomInt(1, 1000000);
    unique = await isUniqueKey(randomKey);
  }

  const query = `
    INSERT INTO classification (id, classification_name)
    VALUES ($1, $2)
    RETURNING *
  `;
  const result = await pool.query(query, [randomKey, classificationName]);
  return result.rows[0];
};

exports.addClassification = async (classificationName) => {
  const query = `
    INSERT INTO classification (classification_name)
    VALUES ($1)
    RETURNING *
  `;
  const result = await pool.query(query, [classificationName]);
  return result.rows[0];
};

exports.addVehicle = async (vehicleData) => {
  const query = `
    INSERT INTO inventory
    (inv_make, inv_model, inv_year, inv_description, inv_image,
     inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;
  const values = [
    vehicleData.inv_make,
    vehicleData.inv_model,
    vehicleData.inv_year,
    vehicleData.inv_description,
    vehicleData.inv_image,
    vehicleData.inv_thumbnail,
    vehicleData.inv_price,
    vehicleData.inv_miles,
    vehicleData.inv_color,
    vehicleData.classification_id
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};
