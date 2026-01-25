const express = require("express");
const router = express.Router();
const Animal = require("../models/Animal");
const User = require("../models/user");

// Daily / Monthly registrations
router.get("/registrations-trend", async (req, res) => {
    try {
        const daily = await Animal.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const monthly = await Animal.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({ success: true, daily, monthly });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// Breed-wise count
router.get("/breed-distribution", async (req, res) => {
    try {
        const result = await Animal.aggregate([
            {
                $group: { _id: "$breed", count: { $sum: 1 } }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({ success: true, data: result });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// Cattle vs Buffalo pie
router.get("/animal-type-summary", async (req, res) => {
    try {
        const result = await Animal.aggregate([
            {
                $group: { _id: "$animalType", count: { $sum: 1 } }
            }
        ]);
        res.json({ success: true, data: result });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// Field worker performance
router.get("/flw-performance", async (req, res) => {
    try {
        const result = await Animal.aggregate([
            {
                $group: {
                    _id: "$userId",
                    total: { $sum: 1 }
                }
            }
        ]);

        const data = [];

        for (let r of result) {
            const user = await User.findById(r._id);
            if (user) {
                data.push({
                    name: user.name,
                    total: r.total
                });
            }
        }

        res.json({ success: true, data });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

module.exports = router;
