// models/Tutor.js
const mongoose = require('mongoose');
const AdvisorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  department: { type: String, required: true },
  user: {  // Thêm mối quan hệ 1-1 với bảng Users
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
}
});
module.exports = mongoose.model('Tutor', AdvisorSchema);
