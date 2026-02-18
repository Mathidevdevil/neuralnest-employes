const mongoose = require('mongoose');
const User = require('../models/User');

const seedUsers = async () => {
    try {
        const adminEmail = 'neuralnest.dev@gmail.com';
        const adminPassword = 'neuralnest2026';

        // Check if Admin exists
        let admin = await User.findOne({ email: adminEmail });

        if (!admin) {
            console.log('Creating Admin User...');
            admin = await User.create({
                name: 'NeuralNest Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                department: 'Management',
                designation: 'Administrator',
                salary: 100000
            });
            console.log('Admin created successfully.');
        } else {
            console.log('Admin user found. Updating password...');
            admin.password = adminPassword;
            await admin.save(); // Triggers password hashing
            console.log('Admin password updated.');
        }

        // Check for Employee (Legacy check)
        const employeeEmail = 'employee@neuralnest.dev';
        const employee = await User.findOne({ email: employeeEmail });
        if (!employee) {
            await User.create({
                name: 'John Doe',
                email: employeeEmail,
                password: 'employee123',
                role: 'employee',
                department: 'Engineering',
                designation: 'Software Engineer',
                salary: 60000
            });
            console.log('Default Employee created.');
        }

        console.log('--- CREDENTIALS ---');
        console.log(`Admin: ${adminEmail} / ${adminPassword}`);
        console.log(`Employee: ${employeeEmail} / employee123`);
        console.log('-------------------');

    } catch (error) {
        console.error('Seeding error:', error);
    }
};

module.exports = seedUsers;
