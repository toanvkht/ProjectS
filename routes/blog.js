const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

router.get('/', async (req, res) => {
  const blogs = await Blog.find().populate('author');
  res.render('blog/index', { blogs });
});

router.get('/add', (req, res) => {
  res.render('blog/add');
});

router.post('/add', async (req, res) => {
  const { title, content } = req.body;
  await Blog.create({ title, content, author: req.user._id });
  res.redirect('/blog');
});

module.exports = router;
