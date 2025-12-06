const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema(
    {
        /* Basic Animal Details */
        tagId: {
            type: String,
            required: true,
            unique: true
        },

        ownerName: {
            type: String,
            required: true
        },

        ownerPhone: {
            type: String,
            required: true
        },

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

        /* Image stored in Cloud / Local path */
        imageUrl: {
            type: String,
            default: ""
        },

        /* AI Predictions stored for history */
        aiPredictions: [
            {
                breed: { type: String },
                confidence: { type: Number },
                modelVersion: { type: String }
            }
        ],

        /* FLW userId who registered the animal */
        registeredBy: {
            type: String,
            required: true   // MUST be in payload: registeredBy: userId
        },

        /* Whether BPA form submitted */
        bpaSubmitted: {
            type: Boolean,
            default: false
        },

        /* Status by Admin */
        status: {
            type: String,
            enum: ["pending", "verified", "rejected"],
            default: "pending"
        }
    },
    {
        timestamps: true   // createdAt & updatedAt automatically included
    }
);

module.exports = mongoose.model("Animal", animalSchema);
