const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || "YOUR_JWT_SECRET_KEY";

// USER LOGIN
router.post("/login", async (req, res) => {
    try {
        const { userId, password } = req.body;

        if (!userId || !password) {
            return res.status(400).json({ success: false, error: "User ID and Password are required" });
        }

        // Check user
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(401).json({ success: false, error: "User not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: "Incorrect password" });
        }

        // Create token
        const token = jwt.sign(
            {
                id: user._id,
                userId: user.userId,
                role: user.role,
                name: user.name,
            },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                name: user.name,
                userId: user.userId,
                role: user.role,
                district: user.district,
                gender: user.gender,
                isTrained: user.isTrained || false,
            },
        });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// GET LOGGED-IN USER DETAILS
router.get("/me", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ success: false, error: "Token missing" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        res.json({ success: true, user });

    } catch (err) {
        return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }
});


// LOGOUT (Frontend token clear)
router.post("/logout", (req, res) => {
    return res.json({ success: true, message: "Logged out successfully" });
});

// TOKEN VERIFY (Useful for frontend auto-login)
router.get("/verify", (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, error: "Token missing" });
        }

        jwt.verify(token, JWT_SECRET);
        res.json({ success: true, message: "Token is valid" });

    } catch (err) {
        return res.status(401).json({ success: false, error: "Invalid token" });
    }
});

module.exports = router;

// REGISTER NEW FLW USER
router.post("/register-flw", async (req, res) => {
    try {
        const { userId, name, password, gender, district, isTrained } = req.body;

        if (!userId || !name || !password) {
            return res.status(400).json({
                success: false,
                error: "User ID, Name and Password are required",
            });
        }

        const existing = await User.findOne({ userId });
        if (existing) {
            return res.status(400).json({
                success: false,
                error: "User ID already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            userId,
            name,
            password: hashedPassword,
            role: "flw",
            gender,
            district,
            isTrained: isTrained || false
        });

        await newUser.save();

        res.json({
            success: true,
            message: "FLW registered successfully",
            user: {
                userId,
                name,
                role: "flw",
            },
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
module.exports = router;