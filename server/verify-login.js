const mongoose = require('mongoose');
const User = require('./models/User');
const dns = require('dns');
require('dotenv').config();

// Force DNS
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) { }

const testLogin = async () => {
    try {
        console.log('Connecting...');
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000, family: 4 });

        const email = 'neuralnest.dev@gmail.com';
        const password = '@Mathi292001';

        const allUsers = await User.find({});
        console.log('Total Users:', allUsers.length);
        allUsers.forEach(u => console.log(`- ${u.email} (${u.role})`));

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User NOT FOUND:', email);
            process.exit(1);
        }

        console.log('User Found:', user.email);
        console.log('Role:', user.role);
        console.log('Stored Hash:', user.password);

        const isMatch = await user.matchPassword(password);
        console.log('Password Match Result:', isMatch);

        if (isMatch) {
            console.log('LOGIN SUCCESS verified.');
        } else {
            console.log('LOGIN FAILED: Password mismatch.');
        }
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testLogin();
