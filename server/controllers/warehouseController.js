const Warehouse = require("../models/warehouse");

// Create a new warehouse
const addWarehouse = async (req, res) => {
    try {
        const { name, address } = req.body;

        if (!name || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newWarehouse = new Warehouse({ name, address });
        await newWarehouse.save();

        res.status(201).json({ message: "Warehouse added successfully", warehouse: newWarehouse });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all warehouses
const getWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find();
        res.status(200).json(warehouses);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get a single warehouse by ID
const getWarehouseById = async (req, res) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id);
        if (!warehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }
        res.status(200).json(warehouse);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a warehouse
const updateWarehouse = async (req, res) => {
    try {
        const { name, address } = req.body;
        const updatedWarehouse = await Warehouse.findByIdAndUpdate(
            req.params.id,
            { name, address },
            { new: true, runValidators: true }
        );

        if (!updatedWarehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        res.status(200).json({ message: "Warehouse updated successfully", warehouse: updatedWarehouse });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a warehouse
const deleteWarehouse = async (req, res) => {
    try {
        const deletedWarehouse = await Warehouse.findByIdAndDelete(req.params.id);
        if (!deletedWarehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        res.status(200).json({ message: "Warehouse deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Export all controller functions
module.exports = {
    addWarehouse,
    getWarehouses,
    getWarehouseById,
    updateWarehouse,
    deleteWarehouse
};
