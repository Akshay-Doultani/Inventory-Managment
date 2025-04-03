const Role = require("../models/role");

// Create a new role
const createRole = async (req, res) => {
    try {
        const { roleName, status } = req.body;
        const newRole = new Role({ roleName, status });
        await newRole.save();
        res.status(201).json(newRole);
    } catch (error) {
        res.status(500).json({ message: "Error creating role", error: error.message });
    }
};

// Get all roles
const getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: "Error fetching roles", error: error.message });
    }
};

// Get a role by ID
const getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: "Error fetching role", error: error.message });
    }
};

// Update a role
const updateRole = async (req, res) => {
    try {
        const { roleName, status } = req.body;
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        role.roleName = roleName || role.roleName;
        role.status = status || role.status;
        await role.save();
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: "Error updating role", error: error.message });
    }
};

// Delete a role
const deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        await role.remove();
        res.status(200).json({ message: "Role deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting role", error: error.message });
    }
};

module.exports = {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole,
};
