var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    name: String,
    email: String
});

var UsersModel = mongoose.model('users', UserSchema);
module.exports = UsersModel;
