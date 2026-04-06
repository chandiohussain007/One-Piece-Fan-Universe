const mongoose = require('mongoose');

const mangaChapterSchema = new mongoose.Schema({
  mangaDexChapterId: {
    type: String,
    required: true,
    unique: true
  },
  mangaDexMangaId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: '',
    trim: true
  },
  volume: {
    type: String,
    default: null
  },
  chapter: {
    type: String,
    default: null
  },
  category: {
    type: String,
    enum: ['Manga', 'One Shots', 'Light Novels'],
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  publishAt: {
    type: Date,
    default: Date.now
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