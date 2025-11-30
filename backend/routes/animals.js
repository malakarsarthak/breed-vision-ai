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

module.exports = router;
