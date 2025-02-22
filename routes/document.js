const express = require('express');
const router = express.Router();
const multer = require('multer');
const Document = require('../models/Document');

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'public/uploads/'); },
  filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage });

router.get('/add', (req, res) => {
  res.render('document/add');
});

router.post('/add', upload.single('file'), async (req, res) => {
  const { title, description } = req.body;
  const fileUrl = '/uploads/' + req.file.filename;
  await Document.create({ title, description, fileUrl, uploadedBy: req.user._id });
  res.redirect('/document');
});

router.get('/', async (req, res) => {
  const documents = await Document.find().populate('uploadedBy');
  res.render('document/index', { documents });
});

module.exports = router;
