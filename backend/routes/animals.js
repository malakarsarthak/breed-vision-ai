const express = require("express");
const router = express.Router();

const animalSchema = require("../models/Animal");   // ✅ FIX ADDED HERE

const {
    registerAnimal,
    getAnimalHistory,
    searchAnimals,
    getAllAnimals,
    getAnimalById,
    getFLWStats
} = require("../controllers/animalController");

// Register animal
router.post("/register", registerAnimal);

// FLW animal history
router.get("/history/:flwId", getAnimalHistory);

// Search animals
router.get("/search", searchAnimals);

// Admin – all animals
router.get("/all", getAllAnimals);

// Get single animal
router.get("/:id", getAnimalById);

// FLW stats
router.get("/flw-stats/:flwId", getFLWStats);

// ⭐ District chart API
router.get("/stats/district", async (req, res) => {
    const data = await animalSchema.aggregate([
        { $group: { _id: "$location", count: { $sum: 1 } } }
    ]);

    res.json({
        success: true,
        data: data.map(x => ({
            location: x._id,
            count: x.count
        }))
    });
});

// ⭐ Breed chart API
router.get("/stats/breed", async (req, res) => {
    const data = await animalSchema.aggregate([
        { $group: { _id: "$breed", count: { $sum: 1 } } }
    ]);

    res.json({
        success: true,
        data: data.map(x => ({
            breed: x._id,
            count: x.count
        }))
    });
});

// ⭐ Daily chart API
router.get("/stats/daily", async (req, res) => {
    const data = await animalSchema.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.json({
        success: true,
        data: data.map(x => ({
            date: x._id,
            count: x.count
        }))
    });
});

// ✅ DELETE SINGLE ANIMAL
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await animalSchema.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: "Record not found" });
        }

        res.json({ success: true, message: "Record deleted" });

    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ DELETE MULTIPLE ANIMALS
router.post("/delete-multiple", async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !ids.length) {
            return res.status(400).json({ error: "No records selected" });
        }

        await animalSchema.deleteMany({ _id: { $in: ids } });

        res.json({ success: true, message: "Multiple records deleted" });

    } catch (err) {
        console.error("Bulk delete error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
