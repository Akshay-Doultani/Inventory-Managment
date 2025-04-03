const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { getCurrentUserPermissions } = require("../controllers/permissionController"); // Correct import

// Login the user and retrieve permissions
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check if the password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Get the user's permissions based on their role using the correct function
        const permissionsResponse = await getCurrentUserPermissions(user);

        if (!permissionsResponse || !permissionsResponse.permissions) {
            return res.status(400).json({ message: "Permissions not found for this user" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Send the user data, including permissions, back to the frontend
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                permissions: permissionsResponse.permissions // Include the permissions
            },
            token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get the current logged-in user's data and permissions
const getCurrentUser = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch the user's permissions using the correct function
        const permissionsResponse = await getCurrentUserPermissions(user);

        if (!permissionsResponse || !permissionsResponse.permissions) {
            return res.status(400).json({ message: "Permissions not found for this user" });
        }

        res.status(200).json({
            id: user._id,
            username: user.username,
            role: user.role,
            permissions: permissionsResponse.permissions
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { loginUser, getCurrentUser };
