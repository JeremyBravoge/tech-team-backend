import pool from '../config/db.js';

// GET comments for a blog
export const getCommentsByBlogId = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM blog_comments WHERE blog_id=? ORDER BY created_at DESC',
      [req.params.blogId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE comment
export const createComment = async (req, res) => {
  const { blog_id, name, comment } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO blog_comments (blog_id, name, comment) VALUES (?, ?, ?)',
      [blog_id, name, comment]
    );
    res.status(201).json({ id: result.insertId, blog_id, name, comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE comment
export const deleteComment = async (req, res) => {
  try {
    await pool.query('DELETE FROM blog_comments WHERE id=?', [req.params.id]);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
