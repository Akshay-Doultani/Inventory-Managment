require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add a new user
const addUser = async (req, res) => {
    const { firstName, lastName, image, cloudinaryId, role, username, contact, employeeId, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            image, // URL of the image
            cloudinaryId, // Cloudinary ID
            role,
            username,
            contact,
            employeeId,
            password: hashedPassword, // Store the hashed password
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser); // Respond with the created user
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        if (users.length === 0) {
            return res.status(200).json({ message: "No users found." }); // Send a message when no users are found
        }

        res.status(200).json(users); // Respond with all users
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific user by ID
const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a user




const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, image, cloudinaryId, role, username, contact, employeeId, password } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // If a new image is uploaded, delete the old one from Cloudinary
        if (image && cloudinaryId && user.cloudinaryId !== cloudinaryId) {
            await cloudinary.uploader.destroy(user.cloudinaryId);
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.image = image;
        user.cloudinaryId = cloudinaryId;
        user.role = role;
        user.username = username;
        user.contact = contact;
        user.employeeId = employeeId;

        // Hash password only if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating user" });
    }
};



// Delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete image from Cloudinary
        if (user.cloudinaryId) {
            await cloudinary.uploader.destroy(user.cloudinaryId);
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
