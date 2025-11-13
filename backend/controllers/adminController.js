const User = require('../models/User');
const pool = require('../config/database');

/**
 * Admin Controller
 * Handles admin-specific operations
 */

/**
 * Get all users
 * GET /api/admin/users
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const users = await User.findAll(parseInt(limit), parseInt(offset));

    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      count: users.length,
      totalCount,
      users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle user active status
 * PUT /api/admin/users/:id/toggle-active
 */
exports.toggleUserActive = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);

    // Prevent admin from deactivating themselves
    if (userId === req.user.userId) {
      return res.status(400).json({ 
        error: 'Cannot deactivate your own account' 
      });
    }

    const result = await User.toggleActive(userId);

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: `User ${result.is_active ? 'activated' : 'deactivated'} successfully`,
      user: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get platform statistics
 * GET /api/admin/stats
 */
exports.getPlatformStats = async (req, res, next) => {
  try {
    const stats = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE is_active = true) as active_users,
        (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
        (SELECT COUNT(*) FROM users WHERE role = 'faculty') as total_faculty,
        (SELECT COUNT(*) FROM doubts) as total_doubts,
        (SELECT COUNT(*) FROM doubts WHERE is_resolved = true) as resolved_doubts,
        (SELECT COUNT(*) FROM answers) as total_answers,
        (SELECT COUNT(*) FROM subjects) as total_subjects
    `);

    // Get doubts by subject
    const doubtsBySubject = await pool.query(`
      SELECT 
        s.subject_name,
        COUNT(d.doubt_id) as count
      FROM subjects s
      LEFT JOIN doubts d ON s.subject_id = d.subject_id
      GROUP BY s.subject_id, s.subject_name
      ORDER BY count DESC
      LIMIT 10
    `);

    // Get top contributors
    const topContributors = await pool.query(`
      SELECT 
        u.user_id,
        u.full_name,
        u.role,
        COUNT(a.answer_id) as answer_count,
        COALESCE(SUM(a.upvotes), 0) as total_upvotes
      FROM users u
      LEFT JOIN answers a ON u.user_id = a.user_id
      GROUP BY u.user_id, u.full_name, u.role
      ORDER BY answer_count DESC, total_upvotes DESC
      LIMIT 10
    `);

    res.json({
      overview: stats.rows[0],
      doubtsBySubject: doubtsBySubject.rows,
      topContributors: topContributors.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get recent activity
 * GET /api/admin/recent-activity
 */
exports.getRecentActivity = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    const recentDoubts = await pool.query(`
      SELECT 
        d.doubt_id,
        d.title,
        d.created_at,
        u.full_name as author_name,
        'doubt' as activity_type
      FROM doubts d
      JOIN users u ON d.user_id = u.user_id
      ORDER BY d.created_at DESC
      LIMIT $1
    `, [parseInt(limit)]);

    const recentAnswers = await pool.query(`
      SELECT 
        a.answer_id,
        a.created_at,
        u.full_name as author_name,
        d.title as doubt_title,
        'answer' as activity_type
      FROM answers a
      JOIN users u ON a.user_id = u.user_id
      JOIN doubts d ON a.doubt_id = d.doubt_id
      ORDER BY a.created_at DESC
      LIMIT $1
    `, [parseInt(limit)]);

    // Combine and sort by timestamp
    const activities = [...recentDoubts.rows, ...recentAnswers.rows]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, parseInt(limit));

    res.json({
      count: activities.length,
      activities
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete any doubt (Admin only)
 * DELETE /api/admin/doubts/:id
 */
exports.deleteDoubt = async (req, res, next) => {
  try {
    const doubtId = parseInt(req.params.id);

    const result = await pool.query(
      'DELETE FROM doubts WHERE doubt_id = $1 RETURNING doubt_id',
      [doubtId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Doubt not found' });
    }

    res.json({ message: 'Doubt deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete any answer (Admin only)
 * DELETE /api/admin/answers/:id
 */
exports.deleteAnswer = async (req, res, next) => {
  try {
    const answerId = parseInt(req.params.id);

    const result = await pool.query(
      'DELETE FROM answers WHERE answer_id = $1 RETURNING answer_id',
      [answerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    next(error);
  }
};
