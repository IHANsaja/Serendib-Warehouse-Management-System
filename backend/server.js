const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config()

const app = express();
app.use(cors());
app.use(express.json());


//MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: "",
    database: process.env.DB_NAME,
});


//Connect DB
db.connect((err) => {
    if(err){
        console.error('DB connection failed: ', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});