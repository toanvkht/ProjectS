var mongoose = require('mongoose');
var MeetingSchema = mongoose.Schema({
    meetingTime: String,
    location: String,
    status: String,
    note: String,
    schedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schedules'
    }
});

var MeetingModel = mongoose.model('meetings', MeetingSchema);
module.exports = MeetingModel;