const Attendance = require('../models/Attendance');

const clockIn = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingAttendance = await Attendance.findOne({
            user: req.user._id,
            date: today
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Already clocked in for today' });
        }

        const attendance = await Attendance.create({
            user: req.user._id,
            date: today,
            clockIn: new Date(),
            status: 'present'
        });

        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const clockOut = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            user: req.user._id,
            date: today
        });

        if (!attendance) {
            return res.status(400).json({ message: 'You have not clocked in' });
        }

        attendance.clockOut = new Date();
        await attendance.save();

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAttendance = async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            const attendance = await Attendance.find().populate('user', 'name email');
            res.json(attendance);
        } else {
            const attendance = await Attendance.find({ user: req.user._id });
            res.json(attendance);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { clockIn, clockOut, getAttendance };
