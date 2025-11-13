const { validationResult } = require('express-validator');

/**
 * Validation Error Handler Middleware
 * Checks for validation errors and returns them in a consistent format
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg
      }))
    });
  }
  
  next();
};

module.exports = handleValidationErrors;
