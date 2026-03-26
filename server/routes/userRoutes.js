const express = require('express');
const router = express.Router();
const { protect, teacherOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Task = require('../models/Task');
const Submission = require('../models/Submission');
const Attendance = require('../models/Attendance');

// Get Profile
router.get('/profile', protect, async (req, res) => {
    const user = req.user.toObject();
    user.enrollmentNo = user.enrollmentNo || user.rollNumber;
    user.technology = user.technology || user.class;
    res.json(user);
});

// Update Profile
router.put('/profile', protect, async (req, res) => {
    const { name, enrollmentNo, technology, skills, avatar } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            if (name !== undefined) user.name = name;
            if (enrollmentNo !== undefined) user.enrollmentNo = enrollmentNo;
            if (technology !== undefined) user.technology = technology;
            if (skills !== undefined) user.skills = skills;
            if (avatar !== undefined) user.avatar = avatar;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile' });
    }
});

// Delete Student (Teacher)
router.delete('/:id', protect, teacherOnly, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Clean up submissions and attendance
        await Promise.all([
            Submission.deleteMany({ studentId: req.params.id }),
            Attendance.deleteMany({ studentId: req.params.id })
        ]);

        res.json({ message: 'Student and related data removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting student' });
    }
});

// Get All Students (Teacher)
router.get('/students', protect, teacherOnly, async (req, res) => {
    try {
        const students = await User.find({ role: 'student' });
        const mappedStudents = students.map(s => ({
            ...s.toObject(),
            enrollmentNo: s.enrollmentNo || s.rollNumber,
            technology: s.technology || s.class
        }));
        res.json(mappedStudents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students' });
    }
});

// Add Staff Member (Teacher)
router.post('/add-staff', protect, teacherOnly, async (req, res) => {
    const { name, email, password, technology } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({
            name, email, password, role: 'teacher', technology
        });

        res.status(201).json({ message: 'Staff member added successfully', user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Error adding staff', error: error.message });
    }
});

// Leaderboard Logic
router.get('/leaderboard', protect, async (req, res) => {
    try {
        const students = await User.find({ role: 'student' });
        const tasks = await Task.find();
        const totalTasks = tasks.length || 1;

        const leaderboard = await Promise.all(students.map(async (student) => {
            const submissions = await Submission.find({ studentId: student._id });
            const attendance = await Attendance.find({ studentId: student._id });

            const completedTasks = submissions.filter(s => s.status !== 'Pending').length;
            const completionRate = Math.min((completedTasks / totalTasks) * 100, 100);
            const avgScore = submissions.reduce((acc, curr) => acc + (curr.score || 0), 0) / (submissions.length || 1);
            const attendanceRate = Math.min((attendance.length / totalTasks) * 100, 100);

            const totalScore = (attendanceRate * 0.4) + (completionRate * 0.4) + (avgScore * 10);

            return {
                _id: student._id,
                name: student.name,
                enrollmentNo: student.enrollmentNo || student.rollNumber,
                score: totalScore.toFixed(2),
                attendanceRate: attendanceRate.toFixed(2),
                completionRate: completionRate.toFixed(2),
                avgScore: avgScore.toFixed(2)
            };
        }));

        leaderboard.sort((a, b) => b.score - a.score);
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard' });
    }
});

module.exports = router;
