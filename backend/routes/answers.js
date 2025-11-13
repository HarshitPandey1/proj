const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const answerController = require('../controllers/answerController');
const { authenticateToken } = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validator');

/**
 * Answer Routes
 */

// Validation rules
const answerValidation = [
  body('doubtId').isInt().withMessage('Valid doubt ID is required'),
  body('answerText').trim().notEmpty().withMessage('Answer text is required'),
  handleValidationErrors
];

const voteValidation = [
  body('voteType').isIn(['upvote', 'downvote']).withMessage('Vote type must be upvote or downvote'),
  handleValidationErrors
];

// GET /api/answers/doubt/:doubtId - Get all answers for a doubt
router.get('/doubt/:doubtId', answerController.getAnswersByDoubt);

// POST /api/answers - Create a new answer (protected)
router.post('/', authenticateToken, answerValidation, answerController.createAnswer);

// PUT /api/answers/:id - Update answer (protected)
router.put('/:id', authenticateToken, answerController.updateAnswer);

// DELETE /api/answers/:id - Delete answer (protected)
router.delete('/:id', authenticateToken, answerController.deleteAnswer);

// POST /api/answers/:id/accept - Accept an answer (protected)
router.post('/:id/accept', authenticateToken, answerController.acceptAnswer);

// POST /api/answers/:id/vote - Vote on an answer (protected)
router.post('/:id/vote', authenticateToken, voteValidation, answerController.voteAnswer);

module.exports = router;
