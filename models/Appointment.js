// models/Appointment.js
const mongoose = require('mongoose');
const AppointmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  meetingDate: { type: Date, required: true },
  note: { type: String },
  meetingType: { type: String, enum: ['direct', 'online'], default: 'direct' }
});
module.exports = mongoose.model('Appointment', AppointmentSchema);
