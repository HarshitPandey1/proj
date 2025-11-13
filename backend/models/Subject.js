const pool = require('../config/database');

/**
 * Subject Model
 * Handles all database operations related to subjects
 */
class Subject {
  /**
   * Get all subjects
   */
  static async findAll() {
    const query = `
      SELECT 
        s.*,
        COUNT(d.doubt_id) as doubt_count
      FROM subjects s
      LEFT JOIN doubts d ON s.subject_id = d.subject_id
      GROUP BY s.subject_id
      ORDER BY s.subject_name ASC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Get subject by ID
   */
  static async findById(subjectId) {
    const query = 'SELECT * FROM subjects WHERE subject_id = $1';
    const result = await pool.query(query, [subjectId]);
    return result.rows[0];
  }

  /**
   * Create a new subject
   */
  static async create(subjectData) {
    const { subjectName, subjectCode, department, description } = subjectData;
    
    const query = `
      INSERT INTO subjects (subject_name, subject_code, department, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [subjectName, subjectCode, department, description];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Update subject
   */
  static async update(subjectId, updateData) {
    const { subjectName, subjectCode, department, description } = updateData;
    
    const query = `
      UPDATE subjects
      SET subject_name = COALESCE($1, subject_name),
          subject_code = COALESCE($2, subject_code),
          department = COALESCE($3, department),
          description = COALESCE($4, description)
      WHERE subject_id = $5
      RETURNING *
    `;
    
    const values = [subjectName, subjectCode, department, description, subjectId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete subject
   */
  static async delete(subjectId) {
    const query = 'DELETE FROM subjects WHERE subject_id = $1 RETURNING subject_id';
    const result = await pool.query(query, [subjectId]);
    return result.rows[0];
  }
}

module.exports = Subject;
