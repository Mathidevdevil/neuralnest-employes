const Meeting = require('../models/Meeting');
const User = require('../models/User');
const sendEmail = require('../services/email.service');

const createMeeting = async (req, res) => {
    try {
        const { title, description, dateTime, attendees } = req.body;

        const meeting = await Meeting.create({
            title,
            description,
            dateTime,
            attendees,
            createdBy: req.user._id
        });

        // Send email to all attendees
        const attendeesList = await User.find({ _id: { $in: attendees } });
        attendeesList.forEach(user => {
            const subject = `New Meeting: ${title}`;
            const text = `You have been invited to a meeting.\n\nTitle: ${title}\nDescription: ${description}\nDate & Time: ${new Date(dateTime).toLocaleString()}\n\nPlease be on time.`;
            sendEmail(user.email, subject, text);
        });

        res.status(201).json(meeting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMeetings = async (req, res) => {
    try {
        // Admin sees all, Employee sees only their meetings
        if (req.user.role === 'admin') {
            const meetings = await Meeting.find().populate('attendees', 'name email').populate('createdBy', 'name');
            res.json(meetings);
        } else {
            const meetings = await Meeting.find({ attendees: req.user._id }).populate('attendees', 'name email').populate('createdBy', 'name');
            res.json(meetings);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

        await meeting.deleteOne();
        res.json({ message: 'Meeting removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createMeeting, getMeetings, deleteMeeting };
