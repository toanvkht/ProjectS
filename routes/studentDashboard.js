const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/student_dashboard', ensureAuthenticated, async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user._id })
            .populate('author', 'fullname')
            .populate({
                path: 'comments.user',
                select: 'fullname'
            });

        res.render('dashboard/studentDashboard', {
            title: 'Student Dashboard',
            studentName: req.user.fullname,
            blogs
        });
    } catch (error) {
        console.error('Lỗi lấy bài blog:', error);
        res.status(500).send('Lỗi máy chủ');
    }
});

module.exports = router;
