const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verify, getUsers, deleteUser, getStats } = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', loginUser);

// Protected routes (require authentication)
router.get('/verify', protect, verify);
router.get('/users', protect, getUsers);
router.get('/stats', protect, isAdmin, getStats);

// Admin-only routes
router.post('/register', protect, isAdmin, registerUser);
router.delete('/users/:id', protect, isAdmin, deleteUser);

module.exports = router;
