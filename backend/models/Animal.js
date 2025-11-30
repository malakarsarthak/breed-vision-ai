const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema(
    {
        tagId: {
            type: String,
            required: true,
            unique: true
        },

        ownerName: { type: String, required: true },
        ownerPhone: { type: String, required: true },

        animalType: {
            type: String,
            enum: ["cattle", "buffalo"],
            required: true
        },

        sex: {
            type: String,
            enum: ["male", "female"],
            required: true
        },

        age: {
            type: Number,
            required: true
        },

        breed: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        imageUrl: { type: String },

        aiPredictions: [
            {
                breed: String,
                confidence: Number,
                modelVersion: String
            }
        ],

        registeredBy: {
            type: String,      // stores FLW userId (example: flw001)
            required: true
        },

        bpaSubmitted: { type: Boolean, default: false },

        status: {
            type: String,
            enum: ["pending", "verified", "rejected"],
            default: "pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Animal", animalSchema);
