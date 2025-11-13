const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validator');

/**
 * Authentication Routes
 */

// Signup validation rules
const signupValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['student', 'faculty']).withMessage('Invalid role'),
  handleValidationErrors
];

// Login validation rules
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

// POST /api/auth/signup - User registration
router.post('/signup', signupValidation, authController.signup);

// POST /api/auth/login - User login
router.post('/login', loginValidation, authController.login);

// GET /api/auth/profile - Get current user profile (protected)
router.get('/profile', authenticateToken, authController.getProfile);

// PUT /api/auth/profile - Update user profile (protected)
router.put('/profile', authenticateToken, authController.updateProfile);

// GET /api/auth/verify - Verify token validity (protected)
router.get('/verify', authenticateToken, authController.verifyToken);

module.exports = router;
