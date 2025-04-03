const express = require("express");
const { addWarehouse, getWarehouseById, getWarehouses, updateWarehouse, deleteWarehouse } =
    require("../controllers/warehouseController");

const router = express.Router();

// Routes
router.post("/", addWarehouse); // Create warehouse
router.get("/", getWarehouses); // Get all warehouses
router.get("/:id", getWarehouseById); // Get warehouse by ID
router.put("/:id", updateWarehouse); // Update warehouse
router.delete("/:id", deleteWarehouse); // Delete warehouse

module.exports = router;
