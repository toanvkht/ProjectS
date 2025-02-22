const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/', async (req, res) => {
  const messages = await Message.find().populate('sender receiver');
  res.render('/message/index', { messages });
});

router.post('/send', async (req, res) => {
  const { receiver, content } = req.body;
  await Message.create({ sender: req.user._id, receiver, content });
  res.redirect('/message');
});

module.exports = router;
