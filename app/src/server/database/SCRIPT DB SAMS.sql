create DATABASE sams;
use sams;

#USER TABLE
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

#PRODUCTS TABLE
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100),
    price DECIMAL(10, 2),
);

#STOCK TABLE
CREATE TABLE stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    quantity INT,
);

#ADDRESS TABLE 
CREATE TABLE address (
    id INT AUTO_INCREMENT PRIMARY KEY,
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    code VARCHAR(20)
);

#CLIENT TABLE
CREATE TABLE client (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
	address_id INT,
);



#VEHICLE TABLE
CREATE TABLE vehicle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    make VARCHAR(100),
    model VARCHAR(100),
    year INT,
    license_plate VARCHAR(20),
);

#EMPLOYEES TABLE
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100),
	email VARCHAR(100),
    phone VARCHAR(20),
);

#SERVICE_ORDER TABLE
CREATE TABLE service_order (
    id INT AUTO_INCREMENT PRIMARY KEY,
	vehicle_id INT,
	employee_id INT,
    user_id INT,
    description TEXT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);
#PRODUCT_ITEM TABLE
CREATE TABLE product_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_order_id INT,
    product_id INT,
    quantity INT,
);






