const Notification = require('../models/Notification');

/**
 * Notification Controller
 * Handles all notification-related operations
 */

/**
 * Get user's notifications
 * GET /api/notifications
 */
exports.getNotifications = async (req, res, next) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const notifications = await Notification.findByUserId(
      req.user.userId,
      parseInt(limit),
      parseInt(offset)
    );

    const unreadCount = await Notification.getUnreadCount(req.user.userId);

    res.json({
      count: notifications.length,
      unreadCount,
      notifications
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread notification count
 * GET /api/notifications/unread-count
 */
exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.getUnreadCount(req.user.userId);

    res.json({ unreadCount: count });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark notification as read
 * PUT /api/notifications/:id/read
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const notificationId = parseInt(req.params.id);

    const notification = await Notification.markAsRead(notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 * PUT /api/notifications/read-all
 */
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.markAllAsRead(req.user.userId);

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete notification
 * DELETE /api/notifications/:id
 */
exports.deleteNotification = async (req, res, next) => {
  try {
    const notificationId = parseInt(req.params.id);

    const result = await Notification.delete(notificationId);

    if (!result) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
};
