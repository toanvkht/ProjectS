const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Lấy danh sách người dùng
router.get('/index', async (req, res) => {
    const users = await User.find();
    res.render('users/index', { users });
});

// Hiển thị form thêm user
router.get('/add', (req, res) => {
    res.render('users/add');
});

// Xử lý thêm user
router.post('/add', async (req, res) => {
    const { name, email, age } = req.body;
    await User.create({ name, email, age });
    res.redirect('/users');
});

// Hiển thị form sửa user
router.get('/edit/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('users/edit', { user });
});

// Xử lý cập nhật user
router.post('/edit/:id', async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/users');
});

// Xóa user
router.post('/delete/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
});

module.exports = router;
