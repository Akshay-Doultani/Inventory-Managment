const express = require('express');
const router = express.Router();
const { getDevices, getDeviceById, createDevice, updateDevice, deleteDevice } = require('../controllers/deviceController');

// Get all devices
router.get('/', getDevices);

// Get a device by ID
router.get('/:id', getDeviceById);

// Admin can create, update, and delete devices
router.post('/', createDevice);
router.put('/:id', updateDevice);
router.delete('/:id', deleteDevice);

module.exports = router;
