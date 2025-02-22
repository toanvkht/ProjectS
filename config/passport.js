const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/Users'); // hoặc đường dẫn chính xác đến model User của bạn

module.exports = function(passport) {
  passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
    // Tìm kiếm người dùng theo username trong CSDL
    Users.findOne({ username: username }, (err, users) => {
      if (err) return done(err);
      if (!users) {
        return done(null, false, { message: 'Không tìm thấy người dùng' });
      }
      // Giả sử bạn có phương thức so sánh mật khẩu
      users.comparePassword(password, (err, isMatch) => {
        if (err) return done(err);
        if (isMatch) return done(null, users);
        else return done(null, false, { message: 'Mật khẩu không đúng' });
      });
    });
  }));

  passport.serializeUser((users, done) => {
    done(null, users.id);
  });

  passport.deserializeUser((id, done) => {
    Users.findById(id, (err, users) => {
      done(err, users);
    });
  });
};
