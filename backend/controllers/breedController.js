// backend/controllers/breedController.js
const OtherBreed = require("../models/OtherBreed");

// Save manually entered breed
exports.saveManualBreed = async (req, res) => {
    try {
        const { breed, flwId } = req.body;

        if (!breed || !breed.trim()) {
            return res.status(400).json({ success: false, error: "Breed cannot be empty" });
        }

        const breedName = breed.trim();

        // Check if breed already exists (case-insensitive)
        const existing = await OtherBreed.findOne({ breedName })
            .collation({ locale: "en", strength: 2 });

        if (existing) {
            return res.json({
                success: true,
                message: "Breed already exists",
                data: existing
            });
        }

        const saved = await OtherBreed.create({
            breedName,
            flwId: flwId || null
        });

        return res.json({
            success: true,
            message: "Breed saved successfully",
            data: saved
        });

    } catch (err) {
        console.error("saveManualBreed Error:", err);

        if (err.code === 11000) {
            return res.json({ success: true, message: "Breed already exists" });
        }

        return res.status(500).json({
            success: false,
            error: "Server error while saving breed"
        });
    }
};


// Optional: Get all manually entered breeds
exports.getAllManualBreeds = async (req, res) => {
    try {
        const list = await OtherBreed.find({}).sort({ createdAt: -1 });
        return res.json({ success: true, data: list });
    } catch (err) {
        console.error("getAllManualBreeds Error:", err);
        return res.status(500).json({ success: false, error: "Server error" });
    }
};
