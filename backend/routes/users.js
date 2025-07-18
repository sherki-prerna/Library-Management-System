const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

// Role-check middleware
function requireRole(role) {
  return (req, res, next) => {
    const actualRole = req.body.requester_role;
    if (!actualRole || actualRole !== role) {
      return res.status(403).send(`Only ${role}s can perform this action.`);
    }
    next();
  };
}

// Register user (Teacher only)
router.post("/registerUser", requireRole("teacher"), async (req, res) => {
  const { username, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3)",
      [username, hashed, role]
    );
    res.send("User registered successfully!");
  } catch (err) {
    res.status(500).send(err.detail || "Registration failed");
  }
});

// Login user
router.post("/loginUser", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.json({ username: user.username, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }

});

module.exports = router;

console.log("👤 User Routes:", router.stack.map(r => r.route?.path || '[MIDDLEWARE]'));
