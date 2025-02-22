var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');
var User = require('../models/Users');

// Hiển thị form đăng ký
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// Xử lý đăng ký
router.post('/register', async (req, res) => {
  var { username, password, password2, role } = req.body;
  let errors = [];
  if (!username || !password || !password2 || !role) {
    errors.push({ msg: 'Vui lòng điền đầy đủ thông tin' });
  }
  if (password !== password2) {
    errors.push({ msg: 'Mật khẩu không khớp' });
  }
  if (errors.length > 0) {
    return res.render('auth/register', { errors, username, role });
  }
  var existing = await User.findOne({ username });
  if (existing) {
    errors.push({ msg: 'Username đã tồn tại' });
    return res.render('auth/register', { errors, username, role });
  }
  var newUser = new User({ username, password, role });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, async (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      await newUser.save();
      res.redirect('/auth/login');
    });
  });
});

// Hiển thị form đăng nhập
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Xử lý đăng nhập
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login'
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/auth/login'));
});

module.exports = router;
