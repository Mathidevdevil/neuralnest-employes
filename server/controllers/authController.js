const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const sendEmail = require('../services/email.service');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, department, designation } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            department,
            designation
        });

        if (user) {
            // Send Welcome Email
            const subject = 'Welcome to NeuralNest - Your Credentials';
            const text = `Hello ${name},\n\nWelcome to NeuralNest! Your account has been created.\n\nHere are your login details:\nEmail: ${email}\nPassword: ${password}\n\nPlease login at: http://localhost:5173/\n\nBest regards,\nNeuralNest Admin`;

            try {
                await sendEmail(email, subject, text);
            } catch (emailError) {
                console.error('Failed to send welcome email:', emailError);
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return res.status(404).json({ success: false, error: "Wrong Password" });
    }

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

const verify = async (req, res) => {
    return res.status(200).json({ success: true, user: req.user })
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'employee' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStats = async (req, res) => {
    try {
        const employeeCount = await User.countDocuments({ role: 'employee' });
        // Future: Add pending tasks count, attendance count, etc.
        res.json({ employees: employeeCount, pendingTasks: 0, todayAttendance: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, verify, getUsers, deleteUser, getStats };
