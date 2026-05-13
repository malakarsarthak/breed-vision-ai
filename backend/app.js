const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require("path");

const connectDB = require('./config/database');

// Import Routes
const authRoutes = require('./routes/auth');
const animalRoutes = require('./routes/animals');
const breedRoutes = require('./routes/breeds');
const userRoutes = require("./routes/users");
const reportsRoutes = require("./routes/reports");

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use("/api/reports", reportsRoutes);


// Static Folder for uploaded images
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/breeds', breedRoutes);
app.use('/api/users', userRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'Backend running successfully',
        database: 'MongoDB connected',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
