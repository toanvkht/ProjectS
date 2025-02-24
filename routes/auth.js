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
    if (req.isAuthenticated()) {
        const redirectPath = getRedirectPath(req.user.role);
        if (redirectPath !== '/auth/login') {
            return res.redirect(redirectPath);
        }
    }
    res.render('auth/login', { message: req.flash('error') });
});


// Xử lý đăng nhập
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            req.flash('error', info ? info.message : 'Đăng nhập thất bại');
            return res.redirect('/auth/login');
        }

        req.logIn(user, (err) => {
            if (err) return next(err);
            console.log('User role:', user.role); // Debugging
            return res.redirect(getRedirectPath(user.role));
        });
    })(req, res, next);
});

// Route đăng xuất
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success_msg', 'Bạn đã đăng xuất');
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

// Middleware đảm bảo đã đăng nhập
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
}

// Hàm hỗ trợ điều hướng theo role
function getRedirectPath(role) {
    switch (role) {
        case 'admin': return '/userpage/admin';
        case 'tutor': return '/userpage/tutor';
        case 'student': return '/userpage/student';
        default: return '/'; // Tránh redirect về `/auth/login` gây vòng lặp
    }
}


module.exports = router;
