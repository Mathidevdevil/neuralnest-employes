const express = require('express');
const router = express.Router();
const { createMeeting, getMeetings, deleteMeeting } = require('../controllers/meetingController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, isAdmin, createMeeting);
router.get('/', protect, getMeetings);
router.delete('/:id', protect, isAdmin, deleteMeeting);

module.exports = router;
