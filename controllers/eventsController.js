import pool from '../config/db.js';

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, banner_url, registration_link } = req.body;
    const [result] = await pool.query(
      "INSERT INTO events (title, description, date, location, banner_url, registration_link) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, date, location, banner_url, registration_link]
    );

    res.status(201).json({
      message: "Event created successfully",
      id: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM events ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get an event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM events WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Event not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an event by ID
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM events WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
