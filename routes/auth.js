const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/Users');

// Xử lý đăng ký
router.post('/register', async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('/auth/register', { message: 'Email đã được sử dụng!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullname, email, password: hashedPassword });

        await newUser.save();
        res.redirect('/auth/login?message=Đăng ký thành công! Vui lòng đăng nhập.');
    } catch (err) {
        console.error(err);
        res.render('/auth/register', { message: 'Đã xảy ra lỗi, vui lòng thử lại!' });
    }
});

// Xử lý đăng nhập
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

// Hiển thị trang đăng nhập với thông báo
router.get('/login', (req, res) => {
    res.render('auth/login', { message: req.query.message || '' });
});

// Hiển thị trang đăng ký
router.get('/register', (req, res) => {
    res.render('auth/register', { message: '' });
});

// Hiển thị dashboard sau khi đăng nhập thành công
router.get('/dashboard', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    }
    res.render('dashboard/index', { user: req.user, message: 'Đăng nhập thành công!' });
});

// Xử lý đăng xuất
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/auth/login');
    });
});

module.exports = router;
