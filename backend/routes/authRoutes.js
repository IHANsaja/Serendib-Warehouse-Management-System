const express = require('express');
const router = express.Router();
const db = require('../config/db');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

//Login
router.post('/login', (req, res) => {
    const { name, password, role } = req.body;

    const query = 'SELECT * FROM EMPLOYEE WHERE Name = ? AND Role = ?';
    db.query(query, [name, role], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(401).json({ error: 'User not found for the given role' });
        }

        const user = results[0];

        if (user.Password !== password) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        res.status(200).json({ message: 'Login Successful', user });
    });
});


module.exports = router;