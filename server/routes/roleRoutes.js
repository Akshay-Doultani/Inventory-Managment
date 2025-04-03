const express = require("express");
const router = express.Router();
const {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole,
} = require("../controllers/roleControllers");

router.post("/", createRole); // No role-based restriction
router.get("/", getRoles);
router.get("/:id", getRoleById);
router.put("/:id", updateRole); // No role-based restriction
router.delete("/:id", deleteRole); // No role-based restriction

module.exports = router;
