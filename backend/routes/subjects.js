const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const subjectController = require('../controllers/subjectController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validator');

/**
 * Subject Routes
 */

// Validation rules
const subjectValidation = [
  body('subjectName').trim().notEmpty().withMessage('Subject name is required'),
  body('subjectCode').trim().notEmpty().withMessage('Subject code is required'),
  handleValidationErrors
];

// GET /api/subjects - Get all subjects
router.get('/', subjectController.getAllSubjects);

// GET /api/subjects/:id - Get subject by ID
router.get('/:id', subjectController.getSubjectById);

// POST /api/subjects - Create a new subject (Admin only)
router.post('/', 
  authenticateToken, 
  authorizeRoles('admin'), 
  subjectValidation, 
  subjectController.createSubject
);

// PUT /api/subjects/:id - Update subject (Admin only)
router.put('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  subjectController.updateSubject
);

// DELETE /api/subjects/:id - Delete subject (Admin only)
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  subjectController.deleteSubject
);

module.exports = router;
