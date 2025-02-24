const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/Users');

// Middleware đảm bảo đã đăng nhập
function ensureAuthenticated(req, res, next) {
    console.log("🔹 Checking authentication:", req.user); // Debug
    if (req.isAuthenticated() && req.user) {
        return next();
    }
    res.redirect('/auth/login');
}

// Middleware kiểm tra role
function checkRole(allowedRoles) {
    return (req, res, next) => {
        if (req.isAuthenticated() && (allowedRoles.includes(req.user.role) || req.user.role === 'admin')) {
            return next();
        }
        req.flash('error', 'Bạn không có quyền truy cập vào trang này!');
        res.redirect('/auth/login');
    };
}

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
        return res.redirect(getRedirectPath(req.user.role));
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

// Route trang cá nhân cho Admin
router.get('/admin', ensureAuthenticated, checkRole(['admin']), (req, res) => {
    res.render('userpage/admin', { user: req.user });
});

// Route trang cá nhân cho Tutor
router.get('/tutor', ensureAuthenticated, checkRole(['tutor']), (req, res) => {
    res.render('userpage/tutor', { user: req.user });
});

// Route trang cá nhân cho Student
router.get('/student', ensureAuthenticated, checkRole(['student']), (req, res) => {
    res.render('userpage/student', { user: req.user });
});

 //Hàm hỗ trợ điều hướng theo role
 function getRedirectPath(role) {
    console.log("🔹 Redirecting role:", role); // Debug
    if (!role) {
        console.error("❌ Role is undefined!"); // Nếu lỗi xảy ra, log ra console
        return '/auth/login';
    }

    switch (role) {
        case 'admin': return '/auth/admin';
        case 'tutor': return '/auth/tutor';
        case 'student': return '/auth/student';
        default: return '/';
    }
}



module.exports = router;
