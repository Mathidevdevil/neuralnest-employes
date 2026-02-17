const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');
require('dotenv').config();

try { dns.setServers(['8.8.8.8', '8.8.4.4']); } catch (e) { }

const run = async () => {
    try {
        console.log('Connecting...');
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000, family: 4 });
        console.log('Connected.');

        const schema = new mongoose.Schema({
            name: String,
            password: { type: String, required: true }
        });

        // REPRODUCE: Inline pre-save hook
        schema.pre('save', async function (next) {
            console.log('Use pre-save hook triggered.');
            if (!this.isModified('password')) return next();
            console.log('Hashing...');
            try {
                this.password = await bcrypt.hash(this.password, 10);
                console.log('Hashed.');
                next();
            } catch (e) {
                console.error('Hash error:', e);
                next(e);
            }
        });

        const TestUser = mongoose.model('TestUser', schema);

        const user = new TestUser({ name: 'Inline Test', password: 'password123' });

        console.log('Saving...');
        await user.save();
        console.log('Saved:', user.password);

        process.exit(0);
    } catch (err) {
        console.error('FAILED:', err);
        process.exit(1);
    }
};

run();
