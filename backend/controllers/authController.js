const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User');

/**
 * Authentication Controller
 * Handles user signup, login, and profile management
 */

/**
 * User Signup
 * POST /api/auth/signup
 */
exports.signup = async (req, res, next) => {
  try {
    const { fullName, email, password, role, department, yearOfStudy } = req.body;

    // Validate email domain
    const emailDomain = email.split('@')[1];
    if (emailDomain !== process.env.COLLEGE_EMAIL_DOMAIN) {
      return res.status(400).json({
        error: `Only ${process.env.COLLEGE_EMAIL_DOMAIN} email addresses are allowed`
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Validate password strength
    if (!password || password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const userData = {
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'student',
      department,
      yearOfStudy
    };

    const user = await User.create(userData);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        userId: user.user_id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        department: user.department,
        yearOfStudy: user.year_of_study
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User Login
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is inactive. Contact admin.' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.user_id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        department: user.department,
        yearOfStudy: user.year_of_study,
        profilePicture: user.profile_picture
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Current User Profile
 * GET /api/auth/profile
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = await User.getStats(req.user.userId);

    res.json({
      user: {
        userId: user.user_id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        department: user.department,
        yearOfStudy: user.year_of_study,
        profilePicture: user.profile_picture,
        createdAt: user.created_at
      },
      stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update User Profile
 * PUT /api/auth/profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, department, yearOfStudy } = req.body;

    const updateData = {
      fullName,
      department,
      yearOfStudy
    };

    const updatedUser = await User.update(req.user.userId, updateData);

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Token
 * GET /api/auth/verify
 */
exports.verifyToken = async (req, res, next) => {
  try {
    // If middleware passed, token is valid
    const user = await User.findById(req.user.userId);
    
    res.json({
      valid: true,
      user: {
        userId: user.user_id,
        fullName: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
