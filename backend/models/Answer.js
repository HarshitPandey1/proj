const pool = require('../config/database');

/**
 * Answer Model
 * Handles all database operations related to answers
 */
class Answer {
  /**
   * Create a new answer
   */
  static async create(answerData) {
    const { doubtId, userId, answerText } = answerData;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert answer
      const query = `
        INSERT INTO answers (doubt_id, user_id, answer_text)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const result = await client.query(query, [doubtId, userId, answerText]);
      const answer = result.rows[0];
      
      // Create notification for doubt owner
      const doubtOwnerQuery = 'SELECT user_id FROM doubts WHERE doubt_id = $1';
      const doubtOwner = await client.query(doubtOwnerQuery, [doubtId]);
      
      if (doubtOwner.rows.length > 0 && doubtOwner.rows[0].user_id !== userId) {
        const userQuery = 'SELECT full_name FROM users WHERE user_id = $1';
        const user = await client.query(userQuery, [userId]);
        
        const notificationQuery = `
          INSERT INTO notifications (user_id, doubt_id, answer_id, type, message)
          VALUES ($1, $2, $3, $4, $5)
        `;
        const message = `${user.rows[0].full_name} answered your doubt`;
        await client.query(notificationQuery, [
          doubtOwner.rows[0].user_id,
          doubtId,
          answer.answer_id,
          'answer',
          message
        ]);
      }
      
      await client.query('COMMIT');
      return answer;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get answers for a doubt
   */
  static async findByDoubtId(doubtId) {
    const query = `
      SELECT 
        a.*,
        u.full_name as author_name,
        u.role as author_role,
        u.department
      FROM answers a
      LEFT JOIN users u ON a.user_id = u.user_id
      WHERE a.doubt_id = $1
      ORDER BY a.is_accepted DESC, a.upvotes DESC, a.created_at ASC
    `;
    
    const result = await pool.query(query, [doubtId]);
    return result.rows;
  }

  /**
   * Get answer by ID
   */
  static async findById(answerId) {
    const query = `
      SELECT 
        a.*,
        u.full_name as author_name,
        u.role as author_role
      FROM answers a
      LEFT JOIN users u ON a.user_id = u.user_id
      WHERE a.answer_id = $1
    `;
    
    const result = await pool.query(query, [answerId]);
    return result.rows[0];
  }

  /**
   * Update answer
   */
  static async update(answerId, answerText) {
    const query = `
      UPDATE answers
      SET answer_text = $1
      WHERE answer_id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [answerText, answerId]);
    return result.rows[0];
  }

  /**
   * Mark answer as accepted
   */
  static async markAsAccepted(answerId, doubtId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Unmark all other answers for this doubt
      await client.query('UPDATE answers SET is_accepted = false WHERE doubt_id = $1', [doubtId]);
      
      // Mark this answer as accepted
      const query = 'UPDATE answers SET is_accepted = true WHERE answer_id = $1 RETURNING *';
      const result = await client.query(query, [answerId]);
      
      // Mark doubt as resolved
      await client.query('UPDATE doubts SET is_resolved = true WHERE doubt_id = $1', [doubtId]);
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete answer
   */
  static async delete(answerId) {
    const query = 'DELETE FROM answers WHERE answer_id = $1 RETURNING answer_id';
    const result = await pool.query(query, [answerId]);
    return result.rows[0];
  }

  /**
   * Vote on an answer
   */
  static async vote(answerId, userId, voteType) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check if user already voted
      const checkVote = await client.query(
        'SELECT * FROM votes WHERE answer_id = $1 AND user_id = $2',
        [answerId, userId]
      );
      
      if (checkVote.rows.length > 0) {
        const existingVote = checkVote.rows[0];
        
        if (existingVote.vote_type === voteType) {
          // Remove vote if clicking the same vote type
          await client.query('DELETE FROM votes WHERE vote_id = $1', [existingVote.vote_id]);
          
          if (voteType === 'upvote') {
            await client.query('UPDATE answers SET upvotes = upvotes - 1 WHERE answer_id = $1', [answerId]);
          } else {
            await client.query('UPDATE answers SET downvotes = downvotes - 1 WHERE answer_id = $1', [answerId]);
          }
        } else {
          // Change vote type
          await client.query('UPDATE votes SET vote_type = $1 WHERE vote_id = $2', [voteType, existingVote.vote_id]);
          
          if (voteType === 'upvote') {
            await client.query('UPDATE answers SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE answer_id = $1', [answerId]);
          } else {
            await client.query('UPDATE answers SET downvotes = downvotes + 1, upvotes = upvotes - 1 WHERE answer_id = $1', [answerId]);
          }
        }
      } else {
        // New vote
        await client.query('INSERT INTO votes (answer_id, user_id, vote_type) VALUES ($1, $2, $3)', [answerId, userId, voteType]);
        
        if (voteType === 'upvote') {
          await client.query('UPDATE answers SET upvotes = upvotes + 1 WHERE answer_id = $1', [answerId]);
        } else {
          await client.query('UPDATE answers SET downvotes = downvotes + 1 WHERE answer_id = $1', [answerId]);
        }
      }
      
      // Get updated answer
      const result = await client.query('SELECT * FROM answers WHERE answer_id = $1', [answerId]);
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get user's vote on an answer
   */
  static async getUserVote(answerId, userId) {
    const query = 'SELECT vote_type FROM votes WHERE answer_id = $1 AND user_id = $2';
    const result = await pool.query(query, [answerId, userId]);
    return result.rows[0]?.vote_type || null;
  }
}

module.exports = Answer;
