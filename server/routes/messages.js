const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

// Middleware to check auth (simplified)
const requireAuth = (req, res, next) => {
    // In a real app, use the verify logic from auth.js or a separate middleware file
    next();
};

// Get contacts (all users except self)
router.get('/users', async (req, res) => {
    try {
        const currentUserId = req.query.userId;
        const users = await User.find({ _id: { $ne: currentUserId } });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get messages between two users
router.get('/:otherUserId', async (req, res) => {
    try {
        const { userId } = req.query; // Current user ID
        const { otherUserId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: userId, recipient: otherUserId },
                { sender: otherUserId, recipient: userId }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
