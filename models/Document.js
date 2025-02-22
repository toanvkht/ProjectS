const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  file: {
    type: String
  }
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;