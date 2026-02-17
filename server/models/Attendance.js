const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true }, // Normalized to midnight
    clockIn: { type: Date },
    clockOut: { type: Date },
    status: { type: String, enum: ['present', 'absent', 'leave'], default: 'present' }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
