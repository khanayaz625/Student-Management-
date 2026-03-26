const express = require('express');
const router = express.Router();
const { protect, teacherOnly } = require('../middleware/authMiddleware');
const Task = require('../models/Task');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { generateQuestions } = require('../utils/aiGenerator');

// Generate and Save Task
router.post('/generate', protect, teacherOnly, async (req, res) => {
    const { topic, difficulty, deadline, technology } = req.body;
    try {
        const questions = await generateQuestions(topic, difficulty);

        // Set date to start of today (UTC)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Multiple tasks allowed per day now
        
        const task = await Task.create({
            teacherId: req.user._id,
            topic,
            difficulty,
            questions,
            deadline: new Date(deadline),
            technology: technology || 'All',
            date: today
        });

        // Notify Students
        const filter = (technology && technology !== 'All') ? { role: 'student', technology } : { role: 'student' };
        const students = await User.find(filter);
        const notifications = students.map(student => ({
            recipient: student._id,
            sender: req.user._id,
            title: 'New Daily Task Assigned',
            message: `A new task on "${topic}" has been assigned for today.`,
            type: 'task'
        }));
        await Notification.insertMany(notifications);

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error generating task', error: error.message });
    }
});

// Get Today's Task
router.get('/today', protect, async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const filter = req.user.role === 'student' ? {
            $or: [
                { technology: { $regex: new RegExp(`^${req.user.technology}$`, 'i') } },
                { technology: 'All' }
            ],
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        } : {
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        };
        const tasks = await Task.find(filter).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching today task' });
    }
});

// Get All Tasks (Teacher)
router.get('/all', protect, teacherOnly, async (req, res) => {
    try {
        const tasks = await Task.find().sort({ date: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

// Update Task
router.put('/:id', protect, teacherOnly, async (req, res) => {
    try {
        const updateData = {};
        if (req.body.topic) updateData.topic = req.body.topic;
        if (req.body.difficulty) updateData.difficulty = req.body.difficulty;
        if (req.body.deadline) updateData.deadline = new Date(req.body.deadline);
        if (req.body.questions) updateData.questions = req.body.questions;

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
});

// Delete Task
router.delete('/:id', protect, teacherOnly, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
});

module.exports = router;
