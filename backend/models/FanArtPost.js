const mongoose = require('mongoose');

const fanArtPostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  type: {
    type: String,
    enum: ['image', 'video', 'text', 'link'], // ✅ added link
    required: true
  },

  title: { // ✅ new
    type: String,
    default: ''
  },

  content: {
    type: String,
    required: true
  },

  credits: { // ✅ new
    type: String,
    default: ''
  },

  mediaUrl: {
    type: String,
    default: ''
  },

  isExternal: { // ✅ new
    type: Boolean,
    default: false
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  reportedCount: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FanArtPost', fanArtPostSchema);