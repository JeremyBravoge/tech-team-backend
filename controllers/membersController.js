import pool from '../config/db.js';

// Create a new member
export const createMember = async (req, res) => {
  try {
    const { avatar_url, full_name, email, password, role, bio, status } = req.body;

    // For invites, if no password provided, set default and status to pending
    const memberPassword = password || 'temp123'; // Default password for invites
    const memberStatus = status || (password ? 'active' : 'pending');

    const [result] = await pool.query(
      `INSERT INTO members (avatar_url, full_name, email, password, role, bio, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [avatar_url, full_name, email, memberPassword, role, bio, memberStatus]
    );

    res.status(201).json({ message: 'Member created successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all members
export const getAllMembers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM members ORDER BY joined_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a member by ID
export const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM members WHERE id = ?', [id]);

    if (rows.length === 0) return res.status(404).json({ message: 'Member not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a member by ID
export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { avatar_url, full_name, email, password, role, bio, status } = req.body;

    const [result] = await pool.query(
      `UPDATE members SET avatar_url=?, full_name=?, email=?, password=?, role=?, bio=?, status=? WHERE id=?`,
      [avatar_url, full_name, email, password, role, bio, status, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Member not found' });

    res.json({ message: 'Member updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a member by ID
export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM members WHERE id=?', [id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Member not found' });

    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
