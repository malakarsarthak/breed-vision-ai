const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const breedController = require("../controllers/breedController");

const UPLOAD_DIR = path.join(__dirname, "../uploads/images");

// Ensure folder exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}


router.post("/recognize-base64", async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({
                success: false,
                error: "Image data is required",
            });
        }

        // Convert base64 → buffer
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        // Generate file name
        const filename = `IMG_${Date.now()}.jpg`;
        const filepath = path.join(UPLOAD_DIR, filename);

        
        fs.writeFileSync(filepath, buffer);

        console.log("✔ Image saved:", filepath);

        
        const aiResponse = await axios.post("http://127.0.0.1:5000/predict", {
            image_path: filepath,
        });

        return res.json({
            success: true,
            predictions: aiResponse.data.prediction,
            savedImage: `/uploads/images/${filename}`,
        });

    } catch (error) {
        console.error("Breed recognition error:", error);

        return res.status(500).json({
            success: false,
            error: "Breed recognition failed",
            details: error.message,
        });
    }
});


router.get("/list", (req, res) => {
    const breeds = [
        "Gir",
        "Sahiwal",
        "Jersey",
        "HF (Holstein Friesian)",
        "Kankrej",
        "Tharparkar",
        "Red Sindhi",
        "Murrah",
        "Nellore",
        "Ongole",
    ];

    res.json({
        success: true,
        data: breeds,
    });
});


router.get("/info/:breed", (req, res) => {
    const info = {
        name: req.params.breed,
        origin: "India",
        milk: "10–18 Litres/day",
        nature: "Calm & High yield",
        weight: "350–550 kg",
    };

    res.json({ success: true, data: info });
});


router.post("/manual", breedController.saveManualBreed);

router.get("/manual", breedController.getAllManualBreeds);


module.exports = router;
