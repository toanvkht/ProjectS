const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Document = require('../models/Document');

// Cấu hình multer để lưu trữ file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Hiển thị trang quản lý tài liệu
router.get('/', async (req, res) => {
    const documents = await Document.find();
    res.render('document/index', { documents });
});

// Hiển thị trang thêm tài liệu
router.get('/add', (req, res) => {
    res.render('document/add');
});

// Xử lý thêm tài liệu
router.post('/add', upload.single('file'), async (req, res) => {
  const { title, author, content } = req.body;
  const file = req.file ? req.file.path : null; // Nếu có file thì lấy, nếu không thì null

  if (!title || !author || !content) {
      return res.render('document/add', { message: 'Vui lòng nhập đầy đủ thông tin!' });
  }

  const newDocument = new Document({ title, author, content, file });
  await newDocument.save();
  res.redirect('/document');
});
// Xử lý tìm kiếm tài liệu
router.get('/search', async (req, res) => {
    const query = req.query.query;
    const documents = await Document.find({ title: new RegExp(query, 'i') });
    res.render('document/index', { documents });
});

module.exports = router;