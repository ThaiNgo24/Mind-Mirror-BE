require("dotenv").config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "khang_hello_meomeo",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  MONGO_URI:
    process.env.MONGO_URI ||
    "mongodb+srv://Thaingo:Thai_24062005@thaingo.5mgb1.mongodb.net/mindmirror",
};
