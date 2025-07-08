// backend/routes/books.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

function requireRole(role) {
  return (req, res, next) => {
    const user = req.body.user || req.query.user;
    if (!user || user.role !== role) {
      return res.status(403).send(`Only ${role}s can perform this action.`);
    }
    next();
  };
}


// Add a book (teacher only)
router.post("/addBook", requireRole("teacher"), async (req, res) => {
  const { id, title, author } = req.body;
  try {
    await pool.query("INSERT INTO books (id, title, author, is_issued) VALUES ($1, $2, $3, false)", [id, title, author]);
    res.send("Book added successfully!");
  } catch (err) {
    res.status(500).send(err.detail || "Failed to add book");
  }
});

// Delete book (teacher only)
router.delete("/deleteBook", requireRole("teacher"), async (req, res) => {
  const { id } = req.query;
  try {
    const result = await pool.query("DELETE FROM books WHERE id = $1", [id]);
    if (result.rowCount === 0) return res.status(404).send("Book not found");
    res.send("Book deleted successfully!");
  } catch (err) {
    res.status(500).send("Delete failed");
  }
});

// List all books (everyone)
router.get("/listBooks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Failed to fetch books");
  }
});

// Issue book (student only)
router.post("/issueBook", requireRole("student"), async (req, res) => {
  const { bookId } = req.body;
  try {
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [bookId]);
    if (result.rows.length === 0) return res.status(404).send("Book not found");
    if (result.rows[0].is_issued) return res.status(400).send("Book already issued");

    await pool.query("UPDATE books SET is_issued = true WHERE id = $1", [bookId]);
    res.send("Book issued successfully!");
  } catch (err) {
    res.status(500).send("Issue failed");
  }
});

// Return book (student only)
router.post("/returnBook", requireRole("student"), async (req, res) => {
  const { bookId } = req.body;
  try {
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [bookId]);
    if (result.rows.length === 0) return res.status(404).send("Book not found");
    if (!result.rows[0].is_issued) return res.status(400).send("Book is not issued");

    await pool.query("UPDATE books SET is_issued = false WHERE id = $1", [bookId]);
    res.send("Book returned successfully!");
  } catch (err) {
    res.status(500).send("Return failed");
  }
});

// Search book
router.get("/searchBook", async (req, res) => {
  const { title } = req.query;
  try {
    const result = await pool.query("SELECT * FROM books WHERE LOWER(title) LIKE LOWER($1)", [`%${title}%`]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Search failed");
  }
});

module.exports = router;

console.log("📚 Book Routes:", router.stack.map(r => r.route?.path || '[MIDDLEWARE]'));

