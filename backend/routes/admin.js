const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

/**
 * Admin Routes
 * All routes require admin authentication
 */

// Middleware: All admin routes require admin role
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// GET /api/admin/users - Get all users
router.get('/users', adminController.getAllUsers);

// PUT /api/admin/users/:id/toggle-active - Toggle user active status
router.put('/users/:id/toggle-active', adminController.toggleUserActive);

// GET /api/admin/stats - Get platform statistics
router.get('/stats', adminController.getPlatformStats);

// GET /api/admin/recent-activity - Get recent activity
router.get('/recent-activity', adminController.getRecentActivity);

// DELETE /api/admin/doubts/:id - Delete any doubt
router.delete('/doubts/:id', adminController.deleteDoubt);

// DELETE /api/admin/answers/:id - Delete any answer
router.delete('/answers/:id', adminController.deleteAnswer);

module.exports = router;
