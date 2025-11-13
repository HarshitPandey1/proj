const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const doubtController = require('../controllers/doubtController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../config/multer');
const handleValidationErrors = require('../middleware/validator');

/**
 * Doubt Routes
 */

// Validation rules
const doubtValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 500 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('subjectId').optional().isInt().withMessage('Subject ID must be an integer'),
  handleValidationErrors
];

// GET /api/doubts - Get all doubts with filters
router.get('/', doubtController.getDoubts);

// GET /api/doubts/my-doubts - Get current user's doubts (protected)
router.get('/my-doubts', authenticateToken, doubtController.getMyDoubts);

// GET /api/doubts/search/:query - Search doubts
router.get('/search/:query', doubtController.searchDoubts);

// GET /api/doubts/:id - Get doubt by ID
router.get('/:id', doubtController.getDoubtById);

// POST /api/doubts - Create a new doubt (protected)
router.post('/', authenticateToken, upload.single('image'), doubtValidation, doubtController.createDoubt);

// PUT /api/doubts/:id - Update doubt (protected)
router.put('/:id', authenticateToken, doubtController.updateDoubt);

// DELETE /api/doubts/:id - Delete doubt (protected)
router.delete('/:id', authenticateToken, doubtController.deleteDoubt);

module.exports = router;
