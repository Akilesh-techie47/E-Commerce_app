// routes/authRoutes.js - Authentication routes (register, login, profile)
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

// @route   GET /api/auth/profile (protected - requires valid token)
router.get('/profile', protect, getProfile);

module.exports = router;
