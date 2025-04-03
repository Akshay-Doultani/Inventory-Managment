const express = require("express");
const router = express.Router();
const {
    addUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require("../controllers/userController");

// Routes
router.post("/add", addUser);         // Add a new user
router.get("/", getUsers);           // Get all users
router.get("/:id", getUserById);     // Get a specific user by ID
router.put("/edit/:id", updateUser); // Update user details
router.delete("/delete/:id", deleteUser); // Delete a user

module.exports = router;
