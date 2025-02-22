const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

router.get('/add', (req, res) => {
  res.render('appointment/add');
});

router.post('/add', async (req, res) => {
  const { student, teacher, meetingDate, note, meetingType } = req.body;
  await Appointment.create({ student, teacher, meetingDate, note, meetingType });
  res.redirect('/appointment');
});

router.get('/', async (req, res) => {
  const appointments = await Appointment.find().populate('student teacher');
  res.render('appointment/index', { appointments });
});

module.exports = router;
