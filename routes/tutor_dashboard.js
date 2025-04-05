const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment'); // Nếu bạn lưu comment riêng

const { ensureAuthenticated } = require('../middleware/auth');

// Dashboard cho tutor
router.get('/tutor_dashboard', ensureAuthenticated, async (req, res) => {
    try {
        const tutorId = req.user._id;

        // Đếm số document do tutor tạo
        const documentCount = await Document.countDocuments({ author: tutorId });

        // Lấy danh sách blog của tutor
        const blogs = await Blog.find({ author: tutorId });

        // Tính tổng comment cho các blog
        let totalComments = 0;
        for (const blog of blogs) {
            totalComments += blog.comments?.length || 0;
        }

        res.render('dashboard/tutor_dashboard', {
            documentCount,
            totalComments,
            tutor: req.user
        });

    } catch (error) {
        console.error('Lỗi dashboard tutor:', error);
        res.status(500).send('Lỗi khi lấy dữ liệu dashboard.');
    }
});

module.exports = router;
