import pool from '../config/db.js';

// GET all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single blog
export const getBlogById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Blog not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE blog
export const createBlog = async (req, res) => {
  const { title, category, author, content, image_url } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO blogs (title, category, author, content, image_url) VALUES (?, ?, ?, ?, ?)',
      [title, category, author, content, image_url]
    );
    res.status(201).json({ id: result.insertId, title, category, author, content, image_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE blog
export const updateBlog = async (req, res) => {
  const { title, category, author, content, image_url } = req.body;
  try {
    await pool.query(
      'UPDATE blogs SET title=?, category=?, author=?, content=?, image_url=? WHERE id=?',
      [title, category, author, content, image_url, req.params.id]
    );
    res.json({ message: 'Blog updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE blog
export const deleteBlog = async (req, res) => {
  try {
    await pool.query('DELETE FROM blogs WHERE id=?', [req.params.id]);
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
