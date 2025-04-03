const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const Warehouse = mongoose.models.Warehouse || mongoose.model("Warehouse", warehouseSchema);

module.exports = Warehouse;
