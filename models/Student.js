// models/Student.js
const mongoose = require('mongoose');
const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor' }
});
module.exports = mongoose.model('Student', StudentSchema);
