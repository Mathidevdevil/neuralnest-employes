const express = require('express');
const router = express.Router();
const { clockIn, clockOut, getAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/clockin', protect, clockIn);
router.post('/clockout', protect, clockOut);
router.get('/', protect, getAttendance);

module.exports = router;
