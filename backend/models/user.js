const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
            default: "male",
        },

        district: {         // <-- ADD THIS
            type: String,
            required: false,
        },

        isTrained: {        // <-- FIX NAME
            type: Boolean,
            default: false,
        },

        role: {
            type: String,
            enum: ["admin", "flw"],
            default: "flw",
        },

        totalBreedsIdentified: {
            type: Number,
            default: 0,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { collection: "users" }
);

module.exports =  mongoose.models.User || mongoose.model("User", userSchema);
