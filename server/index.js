const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns'); // Added for DNS fix

dotenv.config();

// FIX: Force Google DNS to bypass local resolver issues
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log('Using Google DNS (8.8.8.8) for resolution.');
} catch (e) {
    console.warn('Could not set custom DNS:', e.message);
}

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

console.log('Connecting to MongoDB...');

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4 // Force IPv4
})
    .then(() => {
        console.log('MongoDB connected');
        require('./services/seeder')();
    })
    .catch(err => console.error('MongoDB Connection Error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/meetings', require('./routes/meetings'));
app.use('/api/attendance', require('./routes/attendance'));

app.get('/', (req, res) => {
    res.send('NeuralNest API is running');
});

// Import Cron Jobs
require('./services/report.service');

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
