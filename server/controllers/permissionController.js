const Permission = require("../models/permissions");
const mongoose = require("mongoose");
const Role = require("../models/role");

const assignPermissions = async (req, res) => {
    const { roleId, permissions } = req.body;

    if (!roleId) {
        return res.status(400).json({ message: "Role ID is required" });
    }

    // Convert the role to ObjectId if it's not already
    const roleObjectId = new mongoose.Types.ObjectId(roleId);

    // Ensure all permissions are present and initialized
    const sanitizedPermissions = {
        warehouse: {
            list: permissions?.warehouse?.list || false,
            create: permissions?.warehouse?.create || false,
            edit: permissions?.warehouse?.edit || false,
            delete: permissions?.warehouse?.delete || false
        },
        role: {
            list: permissions?.role?.list || false,
            create: permissions?.role?.create || false,
            edit: permissions?.role?.edit || false,
            delete: permissions?.role?.delete || false
        },
        user: {
            list: permissions?.user?.list || false,
            create: permissions?.user?.create || false,
            edit: permissions?.user?.edit || false,
            delete: permissions?.user?.delete || false
        },
        product: {
            list: permissions?.product?.list || false,
            create: permissions?.product?.create || false,
            edit: permissions?.product?.edit || false,
            delete: permissions?.product?.delete || false
        },
        checkIn: {
            checkin: permissions?.checkIn?.checkin || false
        },
        checkOut: {
            checkout: permissions?.checkOut?.checkout || false
        },
        activityLog: {
            assign: permissions?.activityLog?.assign || false
        }
    };

    try {
        // Find the permission record by role ID or create it if it doesn't exist
        let permissionRecord = await Permission.findOne({ role: roleObjectId });

        if (permissionRecord) {
            // Update existing permissions
            permissionRecord.permissions = sanitizedPermissions;
            await permissionRecord.save();
        } else {
            // Create new permissions record if not found
            permissionRecord = new Permission({
                role: roleObjectId,
                permissions: sanitizedPermissions
            });
            await permissionRecord.save();
        }

        res.status(200).json({ message: "Permissions updated successfully" });
    } catch (err) {
        console.error("Error updating permissions:", err);
        res.status(500).json({ message: "Error updating permissions", error: err.message });
    }
};


const getRolePermissions = async (req, res) => {
    try {
        const { roleId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(roleId)) {
            return res.status(400).json({ message: "Invalid roleId format" });
        }

        const roleObjectId = new mongoose.Types.ObjectId(roleId);
        const permissions = await Permission.findOne({ role: roleObjectId });

        if (!permissions) {
            console.log("Permissions not found for role ID:", roleObjectId);
            // Send a 200 response with a message to assign permissions
            return res.status(200).json({ permissions: null, message: "Assign permission for the role" });
        }

        res.json({ permissions: permissions.permissions });
    } catch (error) {
        console.error("Error fetching permissions:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getCurrentUserPermissions = async (user) => {
    console.log("User role from session or token:", user.role); // Log role from session

    try {
        // Log all stored roles in the database
        const allRoles = await Role.find({}, { roleName: 1 });
        console.log("Available roles in DB:", allRoles.map(role => role.roleName));

        // Find role ID
        const roleId = await Role.findOne({ roleName: user.role });
        if (!roleId) {
            throw new Error(`Role '${user.role}' not found in DB`);
        }

        const permissions = await Permission.find({ role: roleId._id });
        return { permissions };
    } catch (error) {
        console.error("Error fetching current user permissions:", error);
        throw error;
    }
};


const getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find().populate("role");
        res.status(200).json(permissions);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

module.exports = {
    assignPermissions,
    getRolePermissions,
    getAllPermissions,
    getCurrentUserPermissions,
};
