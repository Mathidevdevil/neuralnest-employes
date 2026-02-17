// Load required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');

// Load environment variables
dotenv.config();

// Force Google DNS (fix for MongoDB Atlas connection on Render)
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log('Using Google DNS (8.8.8.8)');
} catch (err) {
    console.warn('DNS setting failed:', err.message);
}

// Create Express app
const app = express();

// Middleware
app.use(cors({
    origin: '*', // allow all origins (you can restrict later)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Port
const PORT = process.env.PORT || 5000;

// MongoDB connection
console.log('Connecting to MongoDB...');

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    family: 4 // force IPv4
})
.then(() => {
    console.log('MongoDB connected successfully');

    // Run seeder if exists
    try {
        const seeder = require('./services/seeder');
        seeder();
        console.log('Seeder executed');
    } catch (err) {
        console.log('Seeder not found or already executed');
    }
})
.catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/meetings', require('./routes/meetings'));
app.use('/api/attendance', require('./routes/attendance'));

// Health check route
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'NeuralNest API is running',
        timestamp: new Date()
    });
});

// Load cron jobs (optional)
try {
    require('./services/report.service');
    console.log('Cron service loaded');
} catch (err) {
    console.log('No cron service found');
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unexpected errors
process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', err => {
    console.error('Unhandled Rejection:', err);
});

module.exports = app;
