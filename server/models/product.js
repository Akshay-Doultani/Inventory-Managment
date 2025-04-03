const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    serialNumber: String,
    year: String,
    deviceSize: String,
    deviceType: String,
    emcNumber: String,
    cpu: String,
    gpu: String,
    modelNumber: String,
    identifier: String,
    memory: String,
    storageType: String,
    batteryCapacity: String,
    batteryCycles: String,
    storageSize: String,
    source: String,
    warehouse: String,
    marketplace: String,
    status: String,
    imageUrl: [String],  // Storing multiple Cloudinary URLs
    cloudinaryId: [String], // Storing multiple Cloudinary Public IDs
    fullUnitGrade: String,
    topCaseGrade: String,
    lcdGrade: String,
    notes: String,
    technicalNotes: String,
    technicalCheck: {
        trackPad: Boolean,
        keyboard: Boolean,
        lcdGhostPeel: Boolean,
        soundHeadphoneJack: Boolean,
        microphone: Boolean,
        usbPorts: Boolean,
        bluetoothWifi: Boolean,
        cameraFaceTime: Boolean,
        findMyMac: {
            type: String,
            enum: ['ON', 'OFF']
        },
        mdm: {
            type: String,
            enum: ['YES', 'NO']
        },
        appleCare: {
            type: String,
            enum: ['YES', 'NO']
        }
    },
    createdBy: String // Added the createdBy field
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model("Product", ProductSchema);
