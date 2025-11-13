const Answer = require('../models/Answer');

/**
 * Answer Controller
 * Handles all answer-related operations
 */

/**
 * Create a new answer
 * POST /api/answers
 */
exports.createAnswer = async (req, res, next) => {
  try {
    const { doubtId, answerText } = req.body;

    if (!doubtId || !answerText) {
      return res.status(400).json({ 
        error: 'Doubt ID and answer text are required' 
      });
    }

    const answerData = {
      doubtId: parseInt(doubtId),
      userId: req.user.userId,
      answerText
    };

    const answer = await Answer.create(answerData);

    res.status(201).json({
      message: 'Answer posted successfully',
      answer
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get answers for a doubt
 * GET /api/answers/doubt/:doubtId
 */
exports.getAnswersByDoubt = async (req, res, next) => {
  try {
    const doubtId = parseInt(req.params.doubtId);

    const answers = await Answer.findByDoubtId(doubtId);

    // Get user's votes for each answer if authenticated
    if (req.user) {
      for (let answer of answers) {
        answer.userVote = await Answer.getUserVote(answer.answer_id, req.user.userId);
      }
    }

    res.json({
      count: answers.length,
      answers
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update answer
 * PUT /api/answers/:id
 */
exports.updateAnswer = async (req, res, next) => {
  try {
    const answerId = parseInt(req.params.id);
    const { answerText } = req.body;

    if (!answerText) {
      return res.status(400).json({ error: 'Answer text is required' });
    }

    // Check if answer exists and user owns it
    const existingAnswer = await Answer.findById(answerId);
    
    if (!existingAnswer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // Only owner or admin can update
    if (existingAnswer.user_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedAnswer = await Answer.update(answerId, answerText);

    res.json({
      message: 'Answer updated successfully',
      answer: updatedAnswer
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete answer
 * DELETE /api/answers/:id
 */
exports.deleteAnswer = async (req, res, next) => {
  try {
    const answerId = parseInt(req.params.id);

    // Check if answer exists and user owns it
    const existingAnswer = await Answer.findById(answerId);
    
    if (!existingAnswer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // Only owner or admin can delete
    if (existingAnswer.user_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Answer.delete(answerId);

    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Accept an answer
 * POST /api/answers/:id/accept
 */
exports.acceptAnswer = async (req, res, next) => {
  try {
    const answerId = parseInt(req.params.id);

    const answer = await Answer.findById(answerId);
    
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // Only the doubt owner can accept an answer
    // We need to check if the current user owns the doubt
    const pool = require('../config/database');
    const doubtCheck = await pool.query(
      'SELECT user_id FROM doubts WHERE doubt_id = $1',
      [answer.doubt_id]
    );

    if (doubtCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Doubt not found' });
    }

    if (doubtCheck.rows[0].user_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Only the doubt owner can accept answers' 
      });
    }

    const acceptedAnswer = await Answer.markAsAccepted(answerId, answer.doubt_id);

    res.json({
      message: 'Answer accepted successfully',
      answer: acceptedAnswer
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Vote on an answer
 * POST /api/answers/:id/vote
 */
exports.voteAnswer = async (req, res, next) => {
  try {
    const answerId = parseInt(req.params.id);
    const { voteType } = req.body;

    if (!voteType || !['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ 
        error: 'Valid vote type (upvote or downvote) is required' 
      });
    }

    const answer = await Answer.findById(answerId);
    
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    const updatedAnswer = await Answer.vote(answerId, req.user.userId, voteType);

    res.json({
      message: 'Vote recorded successfully',
      answer: updatedAnswer
    });
  } catch (error) {
    next(error);
  }
};
