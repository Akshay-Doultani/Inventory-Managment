const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes")
const roleRoutes = require("./routes/roleRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");
const devicesRoutes = require("./routes/devicesRoutes");
const productRoutes = require("./routes/productRoutes");

const cors = require("cors");
dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use("/api/users", userRoutes); // Mount user routes
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/devices", devicesRoutes);
app.use("/api", productRoutes);
// Database connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection failed:", err));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
