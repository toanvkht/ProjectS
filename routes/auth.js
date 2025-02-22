const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/Users');

// Hiển thị trang đăng ký
router.get('/register', (req, res) => {
    res.render('auth/register', { message: req.flash('error') });
});

// Xử lý đăng ký
router.post('/register', async (req, res) => {
    const { fullname, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Email đã được sử dụng!');
            return res.redirect('/auth/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullname, email, password: hashedPassword, role });

        await newUser.save();
        req.flash('success', 'Đăng ký thành công! Vui lòng đăng nhập.');
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Đã xảy ra lỗi, vui lòng thử lại!');
        res.redirect('/auth/register');
    }
});

// Hiển thị trang đăng nhập
router.get('/login', (req, res) => {
    res.render('auth/login', { message: req.flash('error') });
});

// Xử lý đăng nhập
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            req.flash('error', info.message);
            return res.redirect('/auth/login');
        }

        req.logIn(user, (err) => {
            if (err) return next(err);

            console.log('User role:', user.role); // Log vai trò của người dùng

            // Điều hướng theo vai trò
            if (user.role === 'admin') {
                return res.redirect('/dashboard/admin');
            } else if (user.role === 'tutor') {
                return res.redirect('/dashboard/tutor');
            } else if (user.role === 'student') {
                return res.redirect('/dashboard/student');
            } else {
                req.flash('error', 'Vai trò không xác định!');
                return res.redirect('/auth/login');
            }
        });
    })(req, res, next);
});

// Hiển thị dashboard theo vai trò
router.get('/dashboard/admin', checkRole('admin'), (req, res) => {
    res.render('dashboard/admin', { user: req.user });
});

router.get('/dashboard/tutor', checkRole('tutor'), (req, res) => {
    res.render('dashboard/tutor', { user: req.user });
});

router.get('/dashboard/student', checkRole('student'), (req, res) => {
    res.render('dashboard/student', { user: req.user });
});

// Xử lý đăng xuất
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Đăng xuất thành công!');
        res.redirect('/auth/login');
    });
});

// Middleware kiểm tra quyền truy cập
function checkRole(role) {
    return (req, res, next) => {
        if (req.isAuthenticated() && req.user.role === role) {
            return next();
        }
        req.flash('error', 'Bạn không có quyền truy cập vào trang này!');
        res.redirect('/auth/login');
    };
}

module.exports = router;