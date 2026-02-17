const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Force Google DNS
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log('DNS servers set to Google DNS (8.8.8.8).');
} catch (e) {
    console.warn('Could not set custom DNS servers:', e.message);
}

console.log('Testing connection...');

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4 // Try forcing IPv4 too
})
    .then(() => {
        console.log('SUCCESS: MongoDB Connected!');
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE:', err.message);
        process.exit(1);
    });
