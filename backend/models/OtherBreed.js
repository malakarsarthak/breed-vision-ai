// backend/models/OtherBreed.js
const mongoose = require("mongoose");

const OtherBreedSchema = new mongoose.Schema(
    {
        breedName: {
            type: String,
            required: true,
            trim: true,
        },

        // Optional: store who entered this breed
        flwId: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true, // automatically adds createdAt, updatedAt
    }
);

// Prevent duplicate values (case-insensitive)
OtherBreedSchema.index(
    { breedName: 1 },
    { unique: true, collation: { locale: "en", strength: 2 } }
);

module.exports = mongoose.model("OtherBreed", OtherBreedSchema);
