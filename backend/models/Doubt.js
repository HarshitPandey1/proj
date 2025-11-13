const pool = require('../config/database');

/**
 * Doubt Model
 * Handles all database operations related to doubts/questions
 */
class Doubt {
  /**
   * Create a new doubt
   */
  static async create(doubtData) {
    const { userId, subjectId, title, description, imageUrl, tags } = doubtData;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert doubt
      const doubtQuery = `
        INSERT INTO doubts (user_id, subject_id, title, description, image_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const doubtResult = await client.query(doubtQuery, [userId, subjectId, title, description, imageUrl]);
      const doubt = doubtResult.rows[0];
      
      // Insert tags if provided
      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          // Get or create tag
          let tagResult = await client.query('SELECT tag_id FROM tags WHERE tag_name = $1', [tagName]);
          let tagId;
          
          if (tagResult.rows.length === 0) {
            const newTag = await client.query('INSERT INTO tags (tag_name) VALUES ($1) RETURNING tag_id', [tagName]);
            tagId = newTag.rows[0].tag_id;
          } else {
            tagId = tagResult.rows[0].tag_id;
          }
          
          // Link tag to doubt
          await client.query('INSERT INTO doubt_tags (doubt_id, tag_id) VALUES ($1, $2)', [doubt.doubt_id, tagId]);
        }
      }
      
      await client.query('COMMIT');
      return doubt;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get doubt by ID with user and subject details
   */
  static async findById(doubtId) {
    const query = `
      SELECT 
        d.*,
        u.full_name as author_name,
        u.role as author_role,
        s.subject_name,
        s.subject_code,
        (SELECT COUNT(*) FROM answers WHERE doubt_id = d.doubt_id) as answer_count,
        ARRAY_AGG(DISTINCT t.tag_name) FILTER (WHERE t.tag_name IS NOT NULL) as tags
      FROM doubts d
      LEFT JOIN users u ON d.user_id = u.user_id
      LEFT JOIN subjects s ON d.subject_id = s.subject_id
      LEFT JOIN doubt_tags dt ON d.doubt_id = dt.doubt_id
      LEFT JOIN tags t ON dt.tag_id = t.tag_id
      WHERE d.doubt_id = $1
      GROUP BY d.doubt_id, u.full_name, u.role, s.subject_name, s.subject_code
    `;
    
    const result = await pool.query(query, [doubtId]);
    return result.rows[0];
  }

  /**
   * Get all doubts with filters and pagination
   */
  static async findAll(filters = {}) {
    const { limit = 20, offset = 0, subjectId, isResolved, userId, search, tag } = filters;
    
    let query = `
      SELECT 
        d.doubt_id, d.title, d.description, d.is_resolved, d.views_count, d.created_at,
        u.full_name as author_name,
        u.role as author_role,
        s.subject_name,
        (SELECT COUNT(*) FROM answers WHERE doubt_id = d.doubt_id) as answer_count,
        ARRAY_AGG(DISTINCT t.tag_name) FILTER (WHERE t.tag_name IS NOT NULL) as tags
      FROM doubts d
      LEFT JOIN users u ON d.user_id = u.user_id
      LEFT JOIN subjects s ON d.subject_id = s.subject_id
      LEFT JOIN doubt_tags dt ON d.doubt_id = dt.doubt_id
      LEFT JOIN tags t ON dt.tag_id = t.tag_id
      WHERE 1=1
    `;
    
    const values = [];
    let paramCount = 0;
    
    if (subjectId) {
      paramCount++;
      query += ` AND d.subject_id = $${paramCount}`;
      values.push(subjectId);
    }
    
    if (isResolved !== undefined) {
      paramCount++;
      query += ` AND d.is_resolved = $${paramCount}`;
      values.push(isResolved);
    }
    
    if (userId) {
      paramCount++;
      query += ` AND d.user_id = $${paramCount}`;
      values.push(userId);
    }
    
    if (search) {
      paramCount++;
      query += ` AND (d.title ILIKE $${paramCount} OR d.description ILIKE $${paramCount})`;
      values.push(`%${search}%`);
    }
    
    if (tag) {
      paramCount++;
      query += ` AND EXISTS (
        SELECT 1 FROM doubt_tags dt2 
        JOIN tags t2 ON dt2.tag_id = t2.tag_id 
        WHERE dt2.doubt_id = d.doubt_id AND t2.tag_name = $${paramCount}
      )`;
      values.push(tag);
    }
    
    query += ` GROUP BY d.doubt_id, u.full_name, u.role, s.subject_name`;
    query += ` ORDER BY d.created_at DESC`;
    
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    values.push(limit);
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    values.push(offset);
    
    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update doubt
   */
  static async update(doubtId, updateData) {
    const { title, description, subjectId, isResolved } = updateData;
    
    const query = `
      UPDATE doubts
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          subject_id = COALESCE($3, subject_id),
          is_resolved = COALESCE($4, is_resolved)
      WHERE doubt_id = $5
      RETURNING *
    `;
    
    const values = [title, description, subjectId, isResolved, doubtId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Increment view count
   */
  static async incrementViews(doubtId) {
    const query = 'UPDATE doubts SET views_count = views_count + 1 WHERE doubt_id = $1';
    await pool.query(query, [doubtId]);
  }

  /**
   * Delete doubt
   */
  static async delete(doubtId) {
    const query = 'DELETE FROM doubts WHERE doubt_id = $1 RETURNING doubt_id';
    const result = await pool.query(query, [doubtId]);
    return result.rows[0];
  }

  /**
   * Search doubts
   */
  static async search(searchTerm, limit = 20) {
    const query = `
      SELECT 
        d.doubt_id, d.title, d.description, d.is_resolved, d.created_at,
        u.full_name as author_name,
        s.subject_name,
        (SELECT COUNT(*) FROM answers WHERE doubt_id = d.doubt_id) as answer_count
      FROM doubts d
      LEFT JOIN users u ON d.user_id = u.user_id
      LEFT JOIN subjects s ON d.subject_id = s.subject_id
      WHERE d.title ILIKE $1 OR d.description ILIKE $1
      ORDER BY d.created_at DESC
      LIMIT $2
    `;
    
    const result = await pool.query(query, [`%${searchTerm}%`, limit]);
    return result.rows;
  }
}

module.exports = Doubt;
