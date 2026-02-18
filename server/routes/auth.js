const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import User model
const { registerUser, verify, getUsers, deleteUser, getStats } = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

// Custom Login Route (Fixed to support Hashed Passwords)
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        console.log("Login request:", email, role);

        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Email, password and role required"
            });
        }

        // 1. Find user by email first
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // 2. Check role matches
        // Note: The user's regex check was strict on role, let's keep it simple or stick to their logic?
        // Simple string comparison is usually enough, but let's be case-insensitive just in case
        if (user.role.toLowerCase() !== role.toLowerCase()) {
            return res.status(401).json({
                success: false,
                message: "Invalid role for this user"
            });
        }

        // 3. Verify Password (using the method from User model)
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(404).json({ success: false, error: "Wrong Password" });
        }

        // 4. Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// Protected routes (require authentication)
router.get('/verify', protect, verify);
router.get('/users', protect, getUsers);
router.get('/stats', protect, isAdmin, getStats);

// Admin-only routes
router.post('/register', protect, isAdmin, registerUser);
router.delete('/users/:id', protect, isAdmin, deleteUser);

module.exports = router;
