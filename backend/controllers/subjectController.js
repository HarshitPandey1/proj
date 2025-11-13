const Subject = require('../models/Subject');

/**
 * Subject Controller
 * Handles all subject-related operations
 */

/**
 * Get all subjects
 * GET /api/subjects
 */
exports.getAllSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.findAll();

    res.json({
      count: subjects.length,
      subjects
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get subject by ID
 * GET /api/subjects/:id
 */
exports.getSubjectById = async (req, res, next) => {
  try {
    const subjectId = parseInt(req.params.id);

    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json({ subject });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new subject (Admin only)
 * POST /api/subjects
 */
exports.createSubject = async (req, res, next) => {
  try {
    const { subjectName, subjectCode, department, description } = req.body;

    if (!subjectName || !subjectCode) {
      return res.status(400).json({ 
        error: 'Subject name and code are required' 
      });
    }

    const subjectData = {
      subjectName,
      subjectCode,
      department,
      description
    };

    const subject = await Subject.create(subjectData);

    res.status(201).json({
      message: 'Subject created successfully',
      subject
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update subject (Admin only)
 * PUT /api/subjects/:id
 */
exports.updateSubject = async (req, res, next) => {
  try {
    const subjectId = parseInt(req.params.id);
    const { subjectName, subjectCode, department, description } = req.body;

    const updateData = {
      subjectName,
      subjectCode,
      department,
      description
    };

    const subject = await Subject.update(subjectId, updateData);

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json({
      message: 'Subject updated successfully',
      subject
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete subject (Admin only)
 * DELETE /api/subjects/:id
 */
exports.deleteSubject = async (req, res, next) => {
  try {
    const subjectId = parseInt(req.params.id);

    const result = await Subject.delete(subjectId);

    if (!result) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    next(error);
  }
};
