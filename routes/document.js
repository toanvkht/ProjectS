const express = require('express');
const router = express.Router();
const Document = require('../models/Document');

// Hiển thị trang quản lý tài liệu
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find(); // Lấy tất cả tài liệu từ database
    console.log('documents:', documents); // Debug log để kiểm tra dữ liệu
    res.render('document/index', { title: 'Quản lý tài liệu', documents });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server khi lấy danh sách tài liệu');
  }
});

// Hiển thị trang thêm tài liệu
router.get('/add', (req, res) => {
    res.render('document/add');
});

// Xử lý thêm tài liệu
router.post('/add', async (req, res) => {
    const { title, author, content, imageUrl } = req.body;
    const newDocument = new Document({ title, author, content, imageUrl });
    await newDocument.save();
    res.redirect('/document');
});

// Xử lý tìm kiếm tài liệu
router.get('/search', async (req, res) => {
    const query = req.query.query;
    const documents = await Document.find({ title: new RegExp(query, 'i') });
    res.render('document/index', { documents });
});

// Edit document route
router.get('/edit/:id', async (req, res) => {
  try {
      const documentId = req.params.id;
      const document = await Document.findById(documentId);

      if (!document) {
          return res.status(404).send('Document not found');
      }

      res.render('document/edit', { document });
  } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).send('Internal Server Error');
  }
});
// Update document route
router.post('/update/:id', async (req, res) => {
  try {
      const documentId = req.params.id;
      const { title, author, content, imageUrl } = req.body;

      await Document.findByIdAndUpdate(documentId, {
          title,
          author,
          content,
          imageUrl
      });

      res.redirect('/document'); // Redirect to the document list page after updating
  } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Xử lý xóa tài liệu với phương thức POST
router.delete('/delete/:id', async (req, res) => {
  try {
      await Document.findByIdAndDelete(req.params.id);
      res.redirect('/document');
  } catch (error) {
      console.error('Lỗi khi xóa tài liệu:', error);
      res.status(500).send('Lỗi máy chủ nội bộ');
  }
});



module.exports = router;