const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verify, getUsers, deleteUser, getStats } = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify', protect, verify);
router.get('/users', protect, getUsers);

router.delete('/users/:id', protect, isAdmin, deleteUser);
router.get('/stats', protect, isAdmin, getStats);

module.exports = router;
