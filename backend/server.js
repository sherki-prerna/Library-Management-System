// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const userRoutes = require("./routes/users");
const bookRoutes = require("./routes/books");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "..", "docs")));


// API Routes
app.use("/api", userRoutes);
app.use("/api", bookRoutes);

// SPA fallback
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "docs", "index.html"));
});



const PORT = process.env.PORT || 18081;
app.listen(PORT, () => {
  console.log(`📡 Server running at http://localhost:${PORT}`);
});
