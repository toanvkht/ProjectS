var mongoose = require('mongoose');
var StaffSchema = mongoose.Schema(
    {
        name: String,
        email: String,
        telephone: String,
        user: {  // Thêm mối quan hệ 1-1 với bảng Users
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        }
    });
var StaffModel = mongoose.model('staffs', StaffSchema);
module.exports = StaffModel;