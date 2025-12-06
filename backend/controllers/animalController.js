const Animal = require("../models/Animal");
const fs = require("fs");
const path = require("path");

const sanitize = (v) => (typeof v === "string" ? v.trim() : v);

// =========================================
// 📌 REGISTER ANIMAL
// =========================================
const registerAnimal = async (req, res) => {
    try {
        const {
            tagId,
            ownerName,
            ownerPhone,
            animalType,
            sex,
            age,
            location,
            breed,
            imageBase64,
            userId        // <-- REQUIRED FOR registeredBy
        } = req.body;

        // 🛑 Validate required fields
        if (!tagId || !ownerName || !ownerPhone || !animalType || !sex || !age || !location || !breed) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields"
            });
        }

        // 🛑 registeredBy must be present
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID (registeredBy) is missing"
            });
        }

        // 🛑 Duplicate Tag check
        const existing = await Animal.findOne({ tagId });
        if (existing) {
            return res.status(400).json({
                success: false,
                error: "Animal with this Tag ID already exists"
            });
        }

        // =========================================
        // 📌 IMAGE SAVE HANDLING
        // =========================================
        let imageUrl = null;

        if (imageBase64) {
            try {
                const matches = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
                const base64Data = matches ? matches[2] : imageBase64;

                let ext = "jpg";
                if (matches && matches[1].includes("png")) ext = "png";

                const filename = `${tagId}_${Date.now()}.${ext}`;
                const folder = path.join(__dirname, "../uploads/animals");

                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder, { recursive: true });
                }

                fs.writeFileSync(path.join(folder, filename), base64Data, "base64");

                imageUrl = `/uploads/animals/${filename}`;
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    error: "Image saving failed"
                });
            }
        }

        // =========================================
        // 📌 Create Animal Entry
        // =========================================
        const animal = new Animal({
            tagId: sanitize(tagId),
            ownerName: sanitize(ownerName),
            ownerPhone: sanitize(ownerPhone),
            animalType: sanitize(animalType),
            sex: sanitize(sex),
            age: Number(age),
            location: sanitize(location),
            breed: sanitize(breed),
            registeredBy: sanitize(userId),   // <-- FIXED
            imageUrl,
            aiPredictions: []
        });

        await animal.save();

        return res.json({
            success: true,
            message: "Animal registered successfully",
            data: animal
        });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};


// =========================================
// 📌 FLW HISTORY
// =========================================
const getAnimalHistory = async (req, res) => {
    try {
        const flwId = req.params.flwId;

        const animals = await Animal.find({ registeredBy: flwId })
            .sort({ createdAt: -1 });

        res.json({ success: true, data: animals });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


// =========================================
// 📌 SEARCH ANIMALS
// =========================================
const searchAnimals = async (req, res) => {
    try {
        const { tagId, breed, registeredBy } = req.query;

        const query = {};

        if (tagId) query.tagId = new RegExp(tagId, "i");
        if (breed) query.breed = new RegExp(breed, "i");
        if (registeredBy) query.registeredBy = registeredBy;

        const animals = await Animal.find(query).sort({ createdAt: -1 });

        res.json({ success: true, data: animals });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


// =========================================
// 📌 ADMIN — ALL ANIMALS
// =========================================
const getAllAnimals = async (req, res) => {
    try {
        const animals = await Animal.find().sort({ createdAt: -1 });
        res.json({ success: true, animals });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


// =========================================
// 📌 GET SINGLE ANIMAL
// =========================================
const getAnimalById = async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id);

        if (!animal) {
            return res.status(404).json({
                success: false,
                error: "Animal not found"
            });
        }

        res.json({ success: true, data: animal });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


// =========================================
// ⭐ FLW DASHBOARD STATISTICS ⭐
// =========================================
const getFLWStats = async (req, res) => {
    try {
        const flwId = req.params.flwId;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        // Today count
        const todayCount = await Animal.countDocuments({
            registeredBy: flwId,
            createdAt: { $gte: today }
        });

        // Month count
        const monthCount = await Animal.countDocuments({
            registeredBy: flwId,
            createdAt: { $gte: monthStart }
        });

        // Default accuracy (can be changed later)
        const accuracy = 100;

        const recent = await Animal.find({ registeredBy: flwId })
            .sort({ createdAt: -1 })
            .limit(3);

        const recentText = recent.map(a =>
            `Registered ${a.tagId} (${a.breed})`
        );

        return res.json({
            success: true,
            today: todayCount,
            month: monthCount,
            accuracy,
            recent: recentText
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


module.exports = {
    registerAnimal,
    getAnimalHistory,
    searchAnimals,
    getAllAnimals,
    getAnimalById,
    getFLWStats
};
