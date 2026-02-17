const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) { }

const run = async () => {
    try {
        console.log('Mongoose Version:', mongoose.version);

        console.log('Connecting...');
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000, family: 4 });
        console.log('Connected.');

        // Define schema inline to avoid import issues for now
        const userSchema = new mongoose.Schema({
            name: String,
            email: String,
            role: String
        }, { strict: false }); // Strict false to see all fields

        const User = mongoose.model('User', userSchema, 'users'); // Explicit collection name

        const users = await User.find({});
        console.log('User Count:', users.length);
        users.forEach(u => {
            console.log(`ID: ${u._id}`);
            console.log(`Email: ${u.email}`);
            console.log(`Role: ${u.role}`);
            console.log(`Password (Hash): ${u.password ? u.password.substring(0, 10) + '...' : 'NONE'}`);
            console.log('---');
        });

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

run();
