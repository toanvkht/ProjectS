var express = require('express');
var router = express.Router();
var multer = require('multer');
var Document = require('../models/Document');

var storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'public/uploads/'); },
  filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
var upload = multer({ storage });

router.get('/add', (req, res) => {
  res.render('document/add');
});

router.post('/add', upload.single('file'), async (req, res) => {
  var { title, description } = req.body;
  var fileUrl = '/uploads/' + req.file.filename;
  await Document.create({ title, description, fileUrl, uploadedBy: req.user._id });
  res.redirect('/document');
});

router.get('/', async (req, res) => {
  var documents = await Document.find().populate('uploadedBy');
  res.render('document/index', { documents });
});

module.exports = router;
