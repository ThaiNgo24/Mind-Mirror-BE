require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');

//api docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Middleware
app.use(
  cors({
    origin:"https://mind-mirror-fe.onrender.com/main.html",
    credentials: true,
  })
);
app.use(express.json()); 

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/posts");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);

// Serve static files
// app.use(express.static(path.join(__dirname, "../FE")));

// // Handle all routes for SPA
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../FE/main.html"));
// });

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


