const express = require('express');
const router = express.Router();
const { protect, teacherOnly } = require('../middleware/authMiddleware');
const Attendance = require('../models/Attendance');

// Mark Attendance
router.post('/mark', protect, async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    try {
        const exists = await Attendance.findOne({ studentId: req.user._id, date: today });
        if (exists) return res.status(400).json({ message: 'Attendance already marked for today' });

        const attendance = await Attendance.create({
            studentId: req.user._id,
            date: today,
            status: 'Present'
        });
        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Error marking attendance', error: error.message });
    }
});

// Get My Attendance
router.get('/my', protect, async (req, res) => {
    try {
        const attendance = await Attendance.find({ studentId: req.user._id });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance' });
    }
});

// Get All Attendance (Teacher)
router.get('/all', protect, teacherOnly, async (req, res) => {
    try {
        const attendance = await Attendance.find().populate('studentId', 'name enrollmentNo technology');
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all attendance' });
    }
});

// Get Attendance by Date (Teacher)
router.get('/by-date/:date', protect, teacherOnly, async (req, res) => {
    try {
        const date = req.params.date; // YYYY-MM-DD
        const attendance = await Attendance.find({ date }).populate('studentId', 'name enrollmentNo');
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance by date' });
    }
});

module.exports = router;
