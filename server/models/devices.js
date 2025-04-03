const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Available', 'Inactive', 'Maintenance'], // Ensure only valid statuses
        default: 'Available', // Default status when no value is provided
    },
});

// Check if the model already exists to avoid recompilation of the same model
const Device = mongoose.models.Device || mongoose.model('Device', deviceSchema);

module.exports = Device;
