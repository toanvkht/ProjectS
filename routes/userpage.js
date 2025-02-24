const express = require('express');
const router = express.Router();
const User = require('../models/Users');

// Hiển thị trang Admin
router.get('/admin', async (req, res) => {
  try {
    const tutors = await User.find({ role: 'tutor' });
    const students = await User.find({ role: 'student' });
    res.render('userpage/admin', { user: req.user, tutors, students });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server khi lấy danh sách người dùng');
  }
});



module.exports = router;
