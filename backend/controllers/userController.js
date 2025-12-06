const User = require("../models/user");

const registerFLW = async (req, res) => {
    try {
        const { userId, name, password, gender, district, trainingCompleted } = req.body;

        if (!userId || !name || !password) {
            return res.json({ success: false, message: "Missing fields" });
        }

        const existing = await User.findOne({ userId });
        if (existing) {
            return res.json({ success: false, message: "User ID already exists" });
        }

        const flw = new User({
            userId,
            name,
            password: hashedPassword,
            role: "flw",
            gender,
            district,
            trainingCompleted
        });

        await flw.save();

        res.json({ success: true, message: "FLW registered successfully" });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { registerFLW };
