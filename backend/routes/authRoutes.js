const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login route
router.post('/login', authController.loginUser);

// Session check route
router.get('/session', authController.checkSession);

// Logout route
router.post('/logout', authController.logoutUser);

module.exports = router;
