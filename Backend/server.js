require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes.js");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // Allows requests from frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Permitted HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Headers for JSON & JWT
  })
);

// Connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // ✅ Un-commented to activate routes


// app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);

app.use('/api/tasks', taskRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
