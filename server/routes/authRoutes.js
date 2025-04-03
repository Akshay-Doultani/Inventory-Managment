const express = require("express");
const router = express.Router();
const { loginUser, getCurrentUser } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware"); // Corrected import

// Login route
router.post("/login", loginUser);

// Current user route (protected)
router.get("/current", authMiddleware, getCurrentUser); // Use the correct middleware name

module.exports = router;
