const pool = require('../config/database');

/**
 * Notification Model
 * Handles all database operations related to notifications
 */
class Notification {
  /**
   * Get notifications for a user
   */
  static async findByUserId(userId, limit = 20, offset = 0) {
    const query = `
      SELECT 
        n.*,
        d.title as doubt_title
      FROM notifications n
      LEFT JOIN doubts d ON n.doubt_id = d.doubt_id
      WHERE n.user_id = $1
      ORDER BY n.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  }

  /**
   * Get unread count for a user
   */
  static async getUnreadCount(userId) {
    const query = 'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false';
    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].count);
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId) {
    const query = 'UPDATE notifications SET is_read = true WHERE notification_id = $1 RETURNING *';
    const result = await pool.query(query, [notificationId]);
    return result.rows[0];
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId) {
    const query = 'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false';
    await pool.query(query, [userId]);
    return { success: true };
  }

  /**
   * Create a notification
   */
  static async create(notificationData) {
    const { userId, doubtId, answerId, type, message } = notificationData;
    
    const query = `
      INSERT INTO notifications (user_id, doubt_id, answer_id, type, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [userId, doubtId, answerId, type, message];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete notification
   */
  static async delete(notificationId) {
    const query = 'DELETE FROM notifications WHERE notification_id = $1 RETURNING notification_id';
    const result = await pool.query(query, [notificationId]);
    return result.rows[0];
  }
}

module.exports = Notification;
