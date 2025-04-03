const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    permissions: {
        warehouse: {
            list: { type: Boolean, default: false },
            create: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        },
        role: {
            list: { type: Boolean, default: false },
            create: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        },
        user: {
            list: { type: Boolean, default: false },
            create: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        },
        product: {
            list: { type: Boolean, default: false },
            create: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        },
        checkIn: {
            checkin: { type: Boolean, default: false }
        },
        checkOut: {
            checkout: { type: Boolean, default: false }
        },
        activityLog: {
            assign: { type: Boolean, default: false }
        }
    }
}, { timestamps: true });

module.exports = mongoose.models.Permission || mongoose.model("Permission", permissionSchema);
