// models/Tutor.js
const mongoose = require('mongoose');
const AdvisorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String
});
module.exports = mongoose.model('Tutor', AdvisorSchema);
