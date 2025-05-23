-- Drop existing tables if they exist
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS classification CASCADE;
DROP TABLE IF EXISTS account CASCADE;

-- Create the account table
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    password VARCHAR(100),
    account_type VARCHAR(50)
);

-- Create the classification table
CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50)
);

-- Create the inventory table
CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    make VARCHAR(50),
    model VARCHAR(50),
    description TEXT,
    inv_image VARCHAR(255),
    inv_thumbnail VARCHAR(255),
    classification_id INT,
    FOREIGN KEY (classification_id) REFERENCES classification(classification_id)
);

-- 1. Insert a new record into the account table
INSERT INTO account (first_name, last_name, email, password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Modify the Tony Stark record to change the account_type to "Admin"
UPDATE account
SET account_type = 'Admin'
WHERE first_name = 'Tony' AND last_name = 'Stark';

-- 3. Delete the Tony Stark record from the database
DELETE FROM account
WHERE first_name = 'Tony' AND last_name = 'Stark';

-- 4. Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors"
UPDATE inventory
SET description = REPLACE(description, 'small interiors', 'a huge interior')
WHERE make = 'GM' AND model = 'Hummer';

-- 5. Use an inner join to select make and model fields from the inventory table
SELECT i.make, i.model, c.classification_name
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6. Update all records in the inventory table to add "/vehicles" to the middle of the file path
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
