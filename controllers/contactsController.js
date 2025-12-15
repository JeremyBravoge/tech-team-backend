import pool from '../config/db.js';

// Create a new contact/message
export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const [result] = await pool.query(
      "INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [name, email, subject, message]
    );

    res.status(201).json({
      message: "Contact created successfully",
      id: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all contacts/messages
export const getAllContacts = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM contacts ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a contact/message by ID
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM contacts WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Contact not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a contact/message by ID
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM contacts WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Contact not found" });
    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
