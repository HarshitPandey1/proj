const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

/**
 * Notification Routes
 * All routes require authentication
 */

// GET /api/notifications - Get user's notifications
router.get('/', authenticateToken, notificationController.getNotifications);

// GET /api/notifications/unread-count - Get unread notification count
router.get('/unread-count', authenticateToken, notificationController.getUnreadCount);

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', authenticateToken, notificationController.markAllAsRead);

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', authenticateToken, notificationController.markAsRead);

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', authenticateToken, notificationController.deleteNotification);

module.exports = router;
