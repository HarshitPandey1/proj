const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user information to request
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      // Attach user info to request
      const user = await User.findById(decoded.userId);
      
      if (!user || !user.is_active) {
        return res.status(403).json({ error: 'User not found or inactive' });
      }

      req.user = {
        userId: user.user_id,
        email: user.email,
        role: user.role,
        fullName: user.full_name
      };

      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Role-based authorization middleware
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

/**
 * Check if user owns the resource
 */
const checkOwnership = (resourceUserIdField = 'user_id') => {
  return (req, res, next) => {
    const resourceUserId = req.body[resourceUserIdField] || 
                          req.params[resourceUserIdField] || 
                          req.resource?.[resourceUserIdField];

    if (!resourceUserId) {
      return res.status(400).json({ error: 'Resource user ID not found' });
    }

    // Admin can access anything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    if (parseInt(resourceUserId) !== req.user.userId) {
      return res.status(403).json({ 
        error: 'Access denied. You can only modify your own resources.' 
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  checkOwnership
};
