const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
const mongoURI = "mongodb+srv://Thaingo:Thai_24062005@thaingo.5mgb1.mongodb.net/mindmirror";
mongoose.connect(mongoURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, "../FE")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../FE/main.html"));
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
