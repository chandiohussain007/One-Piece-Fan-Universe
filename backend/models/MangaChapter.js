const mongoose = require('mongoose');

const mangaChapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  animeName: {
    type: String,
    default: '',
    trim: true
  },
  type: {
    type: String,
    enum: ['upload', 'link', 'html', 'pdf'],
    default: 'link'
  },
  // For uploaded images/pdfs - array of { url, fileType }
  contentFiles: [{
    url: { type: String },
    fileType: { type: String, enum: ['image', 'pdf'], default: 'image' }
  }],
  // For external links
  externalLink: {
    type: String,
    default: ''
  },
  // For HTML embed code (iframes, etc.)
  htmlEmbed: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  coverImage: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

mangaChapterSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MangaChapter', mangaChapterSchema);