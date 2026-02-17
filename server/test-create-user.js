const mongoose = require('mongoose');
const User = require('./models/User');
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
        console.log('Connected. State:', mongoose.connection.readyState);

        console.log('User Model Type:', typeof User);
        if (User) {
            console.log('User Model Name:', User.modelName);
            console.log('User.create function:', typeof User.create);
        } else {
            console.error('CRITICAL: User model is undefined!');
            process.exit(1);
        }

        const email = 'test@example.com';
        await User.deleteOne({ email });
        console.log('Cleanup done.');

        console.log('Instantiating user...');
        const user = new User({
            name: 'Test User',
            email: email,
            password: 'password123',
            role: 'employee'
        });
        console.log('User instance created. Saving...');

        await user.save();
        console.log('User saved:', user._id);

        process.exit(0);
    } catch (err) {
        console.error('CREATION FAILED:', err);
        if (err.errors) console.error('Validation Errors:', err.errors);
        process.exit(1);
    }
};

run();
