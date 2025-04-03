const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
    {
        roleName: { type: String, required: true },
        status: { type: String, default: "Active" }, // Example: Active or Inactive
    },
    { timestamps: true }
);

// Check if the model already exists to prevent overwriting
const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);

module.exports = Role;
