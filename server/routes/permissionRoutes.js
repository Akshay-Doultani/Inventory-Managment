const express = require("express");
const router = express.Router();
const { assignPermissions, getRolePermissions, getAllPermissions, getCurrentUserPermissions } = require("../controllers/permissionController");
const { authMiddleware, isAdmin, hasPermission } = require("../middleware/authMiddleware");

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Only Admins can assign/update permissions
router.post("/assign", isAdmin, assignPermissions);

// Users can view their own permissions
router.get("/:roleId", hasPermission("viewPermissions"), getRolePermissions);

// Only Admins can view all permissions
router.get("/", isAdmin, getAllPermissions);


module.exports = router;