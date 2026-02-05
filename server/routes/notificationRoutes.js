const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');

// Get my notifications
router.get('/', protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

// Mark notification as read
router.put('/:id/read', protect, async (req, res) => {
    try {
        await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user._id },
            { isRead: true }
        );
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking notification as read' });
    }
});

// Mark all as read
router.put('/read-all', protect, async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { isRead: true }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking all as read' });
    }
});

module.exports = router;
