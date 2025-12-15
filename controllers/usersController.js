import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// ------------------------ CREATE USER ------------------------
const createUser = async (req, res) => {
  const { full_name, email, password, role, bio } = req.body;

  if (!full_name || !email || !password || !role) {
    return res.status(400).json({ error: 'full_name, email, password, and role are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    const [existingUser] = await pool.query(checkEmailQuery, [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: `Invalid role. Allowed roles: ${validRoles.join(', ')}` });
    }

    const insertQuery = 'INSERT INTO users (full_name, email, password, role, bio) VALUES (?, ?, ?, ?, ?)';
    const values = [full_name, email, hashedPassword, role, bio];

    const [result] = await pool.query(insertQuery, values);

    res.status(201).json({ id: result.insertId, full_name, email, role, bio });
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).json({ error: 'Failed to insert user' });
  }
};

// ------------------------ GET ALL USERS ------------------------
const getAllUsers = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'You must be an admin to access this route' });
  }

  try {
    const [results] = await pool.query('SELECT id, full_name, email, role, bio FROM users');
    res.json(results);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// ------------------------ GET USER BY EMAIL ------------------------
const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const [results] = await pool.query(
      'SELECT id, full_name, email, role, bio FROM users WHERE email = ?',
      [email]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// ------------------------ UPDATE USER BIO ------------------------
const updateUserBio = async (req, res) => {
  const { email } = req.params;
  const { bio } = req.body;

  try {
    const [result] = await pool.query('UPDATE users SET bio = ? WHERE email = ?', [bio, email]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User bio updated successfully' });
  } catch (err) {
    console.error('Error updating bio:', err);
    res.status(500).json({ error: 'Failed to update bio' });
  }
};

// ------------------------ UPDATE USER PASSWORD ------------------------
const updateUserPassword = async (req, res) => {
  const { email } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ error: 'Failed to update password' });
  }
};

// ------------------------ UPDATE USER ROLE ------------------------
const updateUserRole = async (req, res) => {
  const { email } = req.params;
  const { role } = req.body;

  const validRoles = ['user', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: `Invalid role. Allowed roles: ${validRoles.join(', ')}` });
  }

  try {
    const [result] = await pool.query('UPDATE users SET role = ? WHERE email = ?', [role, email]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User role updated successfully' });
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ error: 'Failed to update role' });
  }
};

// ------------------------ DELETE USER ------------------------
const deleteUser = async (req, res) => {
  const { email } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM users WHERE email = ?', [email]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// ------------------------ EXPORT ------------------------
const verifyEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const [results] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (results.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error('Error verifying email:', err);
    res.status(500).json({ error: 'Failed to verify email' });
  }
};
// ------------------------ GET USER STATS FOR OVERVIEW ------------------------
// ------------------------ GET USER OVERVIEW ------------------------
const getUserOverview = async (req, res) => {
  try {
    // Fetch all users
    const [users] = await pool.query('SELECT role, is_active, email_verified FROM users');

    // Calculate statistics
    const total = users.length;
    const approved = users.filter(u => u.role === 'approved').length;
    const rejected = users.filter(u => u.role === 'rejected').length;
    const pendingReview = users.filter(u => u.role === 'pendingReview').length;
    const awaitingEmailConfirmation = users.filter(u => !u.email_verified).length;
    const inactive = users.filter(u => !u.is_active).length;

    res.json({
      total,
      approved,
      rejected,
      pendingReview,
      awaitingEmailConfirmation,
      inactive,
    });
  } catch (err) {
    console.error('Error fetching overview:', err);
    res.status(500).json({ error: 'Failed to fetch overview data' });
  }
};

// ------------------------ LOGIN USER ------------------------
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
};

export default {
  createUser,
  getAllUsers,
  getUserByEmail,
  updateUserBio,
  updateUserPassword,
  updateUserRole,
  deleteUser,
  loginUser,
  verifyEmail,
  getUserOverview, // ✅ Add this
};

