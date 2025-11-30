const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// ---------------------------------------------
// GET ALL FLWs
// ---------------------------------------------
router.get("/flw", async (req, res) => {
    try {
        const users = await User.find({ role: "flw" }).select("-password");
        return res.json({ success: true, users });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// ---------------------------------------------
// REGISTER NEW FLW
// ---------------------------------------------
router.post("/register-flw", async (req, res) => {
    try {
        const { userId, name, password, gender, district, isTrained } = req.body;

        const existing = await User.findOne({ userId });
        if (existing) {
            return res.status(400).json({
                success: false,
                error: "User ID already exists",
            });
        }

        const hashed = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            userId,
            name,
            password: hashed,
            gender,
            district,
            isTrained,
            role: "flw",
        });

        return res.json({ success: true, user: newUser });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// ---------------------------------------------
// DELETE FLW BY ID
// ---------------------------------------------
router.delete("/delete-flw/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "FLW not found",
            });
        }

        return res.json({
            success: true,
            message: "FLW deleted successfully",
        });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// ---------------------------------------------
// UPDATE / EDIT FLW
// ---------------------------------------------
router.put("/edit-flw/:id", async (req, res) => {
    try {
        const { name, gender, district, isTrained, password } = req.body;

        let updateData = { name, gender, district, isTrained };

        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                error: "FLW not found",
            });
        }

        return res.json({
            success: true,
            message: "FLW updated successfully",
            user: updatedUser,
        });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
