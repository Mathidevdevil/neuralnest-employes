const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();
const seedUsers = require('./services/seeder');

// Force DNS
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    console.warn('DNS set failed:', e.message);
}

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4
})
    .then(async () => {
        console.log('Connected. Running seeder...');
        await seedUsers();
        console.log('Seeder finished.');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection failed:', err);
        process.exit(1);
    });
