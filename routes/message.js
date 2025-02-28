const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const User = require('../models/Users');
const Message = require('../models/Message');

// Trang danh sách người dùng để nhắn tin
router.get('/', ensureAuthenticated, async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user._id } }); // Lấy danh sách user trừ bản thân
    res.render('message', { users });
});

// Trang chat với một người
router.get('/:id', ensureAuthenticated, async (req, res) => {
    const chatUser = await User.findById(req.params.id);
    const messages = await Message.find({
        $or: [
            { sender: req.user._id, receiver: req.params.id },
            { sender: req.params.id, receiver: req.user._id }
        ]
    }).populate('sender');

    res.render('message/chat', { chatUser, messages, user: req.user });
});

module.exports = router;
