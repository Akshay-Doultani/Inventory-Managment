const Device = require('../models/devices');

// Get all devices
const getDevices = async (req, res) => {
    try {
        const devices = await Device.find();
        res.json(devices);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a device by ID
const getDeviceById = async (req, res) => {
    const { id } = req.params;
    try {
        const device = await Device.findById(id);
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }
        res.json(device);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Create a new device
const createDevice = async (req, res) => {
    const { name, status } = req.body;

    try {
        const newDevice = new Device({
            name,
            status,
        });
        await newDevice.save();
        res.status(201).json(newDevice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a device
const updateDevice = async (req, res) => {
    const { id } = req.params;
    const { name, status } = req.body;

    try {
        const updatedDevice = await Device.findByIdAndUpdate(id, { name, status }, { new: true });
        if (!updatedDevice) {
            return res.status(404).json({ message: "Device not found" });
        }
        res.json(updatedDevice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a device
const deleteDevice = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDevice = await Device.findByIdAndDelete(id);
        if (!deletedDevice) {
            return res.status(404).json({ message: "Device not found" });
        }
        res.json({ message: "Device deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getDevices, getDeviceById, createDevice, updateDevice, deleteDevice };
