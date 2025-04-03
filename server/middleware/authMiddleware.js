const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Permission = require("../models/permissions");


const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log("Token decoded:", decoded);

        // Ensure the role is populated as an object
        const user = await User.findById(decoded.id).select("-password").populate("role");
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        //console.log("Authenticated user:", user);
        req.user = user; // Attach user data to request
        next(); // Proceed to next middleware or route handler
    } catch (error) {
        console.log("Token invalid or expired:", error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

const isAdmin = (req, res, next) => {
    // Check if the user is an Admin or SuperAdmin
    //console.log("Checking if user is admin:", req.user.role);
    if (req.user.role !== "Admin") {
        console.log("Access denied. Admins only.");
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next(); // Proceed to next middleware or route handler
};

const hasPermission = (permissionKey) => {
    return async (req, res, next) => {
        try {
            const role = req.user.role;
            //console.log("Checking permissions for role:", role);

            // Admin has all permissions by default
            if (role === "Admin") {
                //console.log("Admin role detected. Granting all permissions.");
                return next();
            }

            const permissions = await Permission.findOne({ role });
            //console.log("Permissions found:", permissions);

            // Ensure permissions exist and check the specific permission
            if (!permissions || !permissions.permissions || !permissions.permissions[permissionKey]) {
                console.log("Access denied. Insufficient permissions.");
                return res.status(403).json({ message: "Access denied. Insufficient permissions." });
            }

            next(); // Proceed to next middleware or route handler
        } catch (error) {
            console.log("Permission check error:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
};




module.exports = { authMiddleware, isAdmin, hasPermission };
