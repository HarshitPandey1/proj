const pool = require('../config/database');

/**
 * User Model
 * Handles all database operations related to users
 */
class User {
  /**
   * Create a new user
   */
  static async create(userData) {
    const { fullName, email, passwordHash, role = 'student', department, yearOfStudy } = userData;
    
    const query = `
      INSERT INTO users (full_name, email, password_hash, role, department, year_of_study)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING user_id, full_name, email, role, department, year_of_study, created_at
    `;
    
    const values = [fullName, email, passwordHash, role, department, yearOfStudy];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  /**
   * Find user by ID
   */
  static async findById(userId) {
    const query = `
      SELECT user_id, full_name, email, role, department, year_of_study, 
             profile_picture, is_active, created_at
      FROM users WHERE user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Get all users (for admin)
   */
  static async findAll(limit = 50, offset = 0) {
    const query = `
      SELECT user_id, full_name, email, role, department, year_of_study, 
             is_active, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  /**
   * Update user profile
   */
  static async update(userId, updateData) {
    const { fullName, department, yearOfStudy, profilePicture } = updateData;
    
    const query = `
      UPDATE users 
      SET full_name = COALESCE($1, full_name),
          department = COALESCE($2, department),
          year_of_study = COALESCE($3, year_of_study),
          profile_picture = COALESCE($4, profile_picture)
      WHERE user_id = $5
      RETURNING user_id, full_name, email, role, department, year_of_study, profile_picture
    `;
    
    const values = [fullName, department, yearOfStudy, profilePicture, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Toggle user active status (for admin)
   */
  static async toggleActive(userId) {
    const query = `
      UPDATE users 
      SET is_active = NOT is_active
      WHERE user_id = $1
      RETURNING user_id, is_active
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Get user statistics
   */
  static async getStats(userId) {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM doubts WHERE user_id = $1) as doubts_posted,
        (SELECT COUNT(*) FROM answers WHERE user_id = $1) as answers_given,
        (SELECT COALESCE(SUM(upvotes), 0) FROM answers WHERE user_id = $1) as total_upvotes
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = User;
