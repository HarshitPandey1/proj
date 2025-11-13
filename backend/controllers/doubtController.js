const Doubt = require('../models/Doubt');
const Notification = require('../models/Notification');

/**
 * Doubt Controller
 * Handles all doubt-related operations
 */

/**
 * Create a new doubt
 * POST /api/doubts
 */
exports.createDoubt = async (req, res, next) => {
  try {
    const { title, description, subjectId, tags } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const doubtData = {
      userId: req.user.userId,
      subjectId: subjectId || null,
      title,
      description,
      imageUrl: req.file ? req.file.filename : null,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : []
    };

    const doubt = await Doubt.create(doubtData);

    res.status(201).json({
      message: 'Doubt posted successfully',
      doubt
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all doubts with filters
 * GET /api/doubts
 */
exports.getDoubts = async (req, res, next) => {
  try {
    const { 
      limit = 20, 
      offset = 0, 
      subjectId, 
      isResolved, 
      userId,
      search,
      tag 
    } = req.query;

    const filters = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      subjectId: subjectId ? parseInt(subjectId) : undefined,
      isResolved: isResolved !== undefined ? isResolved === 'true' : undefined,
      userId: userId ? parseInt(userId) : undefined,
      search,
      tag
    };

    const doubts = await Doubt.findAll(filters);

    res.json({
      count: doubts.length,
      doubts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get doubt by ID
 * GET /api/doubts/:id
 */
exports.getDoubtById = async (req, res, next) => {
  try {
    const doubtId = parseInt(req.params.id);

    const doubt = await Doubt.findById(doubtId);

    if (!doubt) {
      return res.status(404).json({ error: 'Doubt not found' });
    }

    // Increment view count
    await Doubt.incrementViews(doubtId);

    res.json({ doubt });
  } catch (error) {
    next(error);
  }
};

/**
 * Update doubt
 * PUT /api/doubts/:id
 */
exports.updateDoubt = async (req, res, next) => {
  try {
    const doubtId = parseInt(req.params.id);
    const { title, description, subjectId, isResolved } = req.body;

    // Check if doubt exists and user owns it
    const existingDoubt = await Doubt.findById(doubtId);
    
    if (!existingDoubt) {
      return res.status(404).json({ error: 'Doubt not found' });
    }

    // Only owner or admin can update
    if (existingDoubt.user_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData = {
      title,
      description,
      subjectId,
      isResolved: isResolved !== undefined ? isResolved : undefined
    };

    const updatedDoubt = await Doubt.update(doubtId, updateData);

    res.json({
      message: 'Doubt updated successfully',
      doubt: updatedDoubt
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete doubt
 * DELETE /api/doubts/:id
 */
exports.deleteDoubt = async (req, res, next) => {
  try {
    const doubtId = parseInt(req.params.id);

    // Check if doubt exists and user owns it
    const existingDoubt = await Doubt.findById(doubtId);
    
    if (!existingDoubt) {
      return res.status(404).json({ error: 'Doubt not found' });
    }

    // Only owner or admin can delete
    if (existingDoubt.user_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Doubt.delete(doubtId);

    res.json({ message: 'Doubt deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Search doubts
 * GET /api/doubts/search/:query
 */
exports.searchDoubts = async (req, res, next) => {
  try {
    const searchTerm = req.params.query;
    const limit = parseInt(req.query.limit) || 20;

    const doubts = await Doubt.search(searchTerm, limit);

    res.json({
      count: doubts.length,
      doubts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's own doubts
 * GET /api/doubts/my-doubts
 */
exports.getMyDoubts = async (req, res, next) => {
  try {
    const doubts = await Doubt.findAll({ 
      userId: req.user.userId,
      limit: 50
    });

    res.json({
      count: doubts.length,
      doubts
    });
  } catch (error) {
    next(error);
  }
};
