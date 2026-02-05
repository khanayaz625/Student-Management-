const express = require('express');
const router = express.Router();
const { protect, teacherOnly } = require('../middleware/authMiddleware');
const Submission = require('../models/Submission');
const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification');
const { reviewSubmission } = require('../utils/aiGenerator');

// Submit Task
router.post('/', protect, async (req, res) => {
    const { taskId, answers } = req.body;
    try {
        let submission = await Submission.findOne({ taskId, studentId: req.user._id });

        if (submission) {
            if (submission.status === 'Reviewed') {
                return res.status(400).json({ message: 'Task already reviewed and cannot be changed' });
            }
            submission.answers = answers;
            submission.submittedAt = Date.now();
            await submission.save();
        } else {
            submission = await Submission.create({
                taskId,
                studentId: req.user._id,
                answers,
                status: 'Submitted'
            });
        }

        // Link Attendance: Automatically mark present for today upon submission
        const today = new Date().toISOString().split('T')[0];
        const attendanceExists = await Attendance.findOne({ studentId: req.user._id, date: today });
        if (!attendanceExists) {
            await Attendance.create({
                studentId: req.user._id,
                date: today,
                status: 'Present'
            });
        }

        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting task' });
    }
});

// Get My Submissions
router.get('/my', protect, async (req, res) => {
    try {
        const submissions = await Submission.find({ studentId: req.user._id }).populate('taskId');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching submissions' });
    }
});

// Get Submissions for a Task (Teacher)
router.get('/task/:taskId', protect, teacherOnly, async (req, res) => {
    try {
        const submissions = await Submission.find({ taskId: req.params.taskId }).populate('studentId', 'name enrollmentNo technology');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task submissions' });
    }
});

// Get Submissions for a Student (Teacher)
router.get('/student/:studentId', protect, teacherOnly, async (req, res) => {
    try {
        const submissions = await Submission.find({ studentId: req.params.studentId }).populate('taskId');
        res.json(submissions);
    } catch (error) {
        console.error('Submission Fetch Error:', error);
        res.status(500).json({ message: 'Error fetching student submissions', details: error.message });
    }
});

// Review Submission (Teacher)
router.put('/review/:id', protect, teacherOnly, async (req, res) => {
    const { score, feedback } = req.body;
    try {
        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            { score, feedback, status: 'Reviewed' },
            { new: true }
        ).populate('taskId');

        // Notify Student
        await Notification.create({
            recipient: submission.studentId,
            sender: req.user._id,
            title: 'Task Reviewed',
            message: `Your task "${submission.taskId.topic}" has been reviewed. Score: ${score}/10`,
            type: 'review'
        });

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Error reviewing submission' });
    }
});

// AI Review Submission (Teacher)
router.post('/ai-review/:id', protect, teacherOnly, async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id).populate('taskId');
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        if (!submission.taskId) {
            return res.status(400).json({ message: 'Cannot review submission for a deleted task' });
        }

        const review = await reviewSubmission(
            submission.taskId.topic,
            submission.taskId.questions,
            submission.answers
        );

        submission.score = review.score;
        submission.feedback = review.feedback;
        submission.status = 'Reviewed';
        await submission.save();

        // Notify Student
        await Notification.create({
            recipient: submission.studentId,
            sender: req.user._id,
            title: 'Task Reviewed (AI)',
            message: `Your task "${submission.taskId.topic}" has been reviewed by DigiSkill AI. Score: ${review.score}/10`,
            type: 'review'
        });

        res.json(submission);
    } catch (error) {
        console.error("AI Review Route Error:", error);
        res.status(500).json({ message: 'Error performing AI review', error: error.message });
    }
});

module.exports = router;
