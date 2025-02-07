const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MySQL Database Connection (with your details)
const db = mysql.createConnection({
  host: 'zeal-education.c3eok6uco5kg.us-east-1.rds.amazonaws.com',
  user: 'Zeal_Master_ID',
  password: 'Zeal_Master_Password',
  database: 'zeal_education' // This database name will be created dynamically if not already created
});

// Connect to MySQL
db.connect(err => {
  if (err) throw err;
  console.log('Connected to AWS RDS');
  
  // Create database if it doesn't exist
  db.query('CREATE DATABASE IF NOT EXISTS zeal_education', (err, result) => {
    if (err) throw err;
    console.log('Database created or already exists.');
    
    // Create table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100),
        middle_name VARCHAR(100),
        last_name VARCHAR(100),
        age INT,
        phone VARCHAR(15),
        email VARCHAR(255) UNIQUE,
        dob DATE,
        address TEXT,
        aadhar VARCHAR(12) UNIQUE,
        field_interest VARCHAR(50),
        gender ENUM('male', 'female', 'other')
      )
    `;
    
    db.query(createTableQuery, (err, result) => {
      if (err) throw err;
      console.log('Users table created or already exists.');
    });
  });
});

// Registration Route
app.post('/register', (req, res) => {
  const { first_name, middle_name, last_name, age, phone, email, dob, address, aadhar, field_interest, gender } = req.body;

  const query = `
    INSERT INTO users (first_name, middle_name, last_name, age, phone, email, dob, address, aadhar, field_interest, gender) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [first_name, middle_name, last_name, age, phone, email, dob, address, aadhar, field_interest, gender], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error registering user' });
    }
    res.status(200).json({ message: 'User registered successfully!' });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
