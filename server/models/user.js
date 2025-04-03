const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        image: { type: String }, // URL of the image
        cloudinaryId: { type: String }, // Store the Cloudinary public ID for reference
        role: { type: String, required: true },
        username: { type: String, unique: true, required: true },
        contact: { type: String, required: true },
        employeeId: { type: String, unique: true, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);
const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
