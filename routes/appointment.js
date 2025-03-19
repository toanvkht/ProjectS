const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Lấy danh sách cuộc hẹn
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('student teacher');
    res.render('appointment/index', { appointments });
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi server');
  }
});

// Hiển thị form thêm cuộc hẹn
router.get('/add', (req, res) => {
  res.render('appointment/add');
});

// Xử lý thêm cuộc hẹn
router.post('/add', async (req, res) => {
  try {
    const { student, teacher, meetingDate, note, meetingType } = req.body;
    await Appointment.create({ student, teacher, meetingDate, note, meetingType });
    res.redirect('/appointment');
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi khi thêm cuộc hẹn');
  }
});

module.exports = router;
