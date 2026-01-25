const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema(
    {
        
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

        
        species: {
            type: String,
            enum: ["cow", "buffalo", "unknown"],
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

        
        imageUrl: {
            type: String,
            default: ""
        },

        
        aiPredictions: [
            {
                breed: { type: String },
                confidence: { type: Number },
                species: { type: String },  
                modelVersion: { type: String }
            }
        ],

        
        registeredBy: {
            type: String,
            required: true
        },

        bpaSubmitted: {
            type: Boolean,
            default: false
        },

        status: {
            type: String,
            enum: ["pending", "verified", "rejected"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Animal", animalSchema);