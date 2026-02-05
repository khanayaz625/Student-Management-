const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Format YYYY-MM-DD to ensure one per day
    status: { type: String, enum: ['Present', 'Absent'], default: 'Present' },
    markedAt: { type: Date, default: Date.now }
});

// Ensure a student can only have one attendance record per day
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
