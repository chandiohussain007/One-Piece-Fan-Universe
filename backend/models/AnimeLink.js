const mongoose = require('mongoose');

const animeLinkSchema = new mongoose.Schema({
  animeTitle: {
    type: String,
    required: true,
    trim: true
  },
  episodeNumber: {
    type: Number,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AnimeLink', animeLinkSchema);