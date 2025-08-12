const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../utils/authMiddleware");
const User = require("../models/User");

// Lấy thông tin user
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Profile error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching profile" });
  }
});

module.exports = router;
