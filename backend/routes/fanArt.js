const express = require('express');
const FanArtPost = require('../models/FanArtPost');
const Comment = require('../models/Comment');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get approved fan art posts
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const posts = await FanArtPost.find({ status: 'approved' })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await FanArtPost.countDocuments({ status: 'approved' });
    
    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trending fan art
router.get('/trending', async (req, res) => {
  try {
    const posts = await FanArtPost.find({ status: 'approved' })
      .populate('user', 'username avatar')
      .sort({ likes: -1, createdAt: -1 })
      .limit(10);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create fan art post
router.post('/', auth, async (req, res) => {
  try {
    const { type, content, mediaUrl } = req.body;
    const post = new FanArtPost({
      user: req.user._id,
      type,
      content,
      mediaUrl,
      status: 'pending'
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/unlike post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await FanArtPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id.toString();
    const likeIndex = post.likes.findIndex(id => id.toString() === userId);
    if (likeIndex === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    // Return full likes array so frontend can compute isLiked correctly
    res.json({ likes: post.likes.map(id => id.toString()) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Report post
router.post('/:id/report', auth, async (req, res) => {
  try {
    const post = await FanArtPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    post.reportedCount += 1;
    await post.save();
    res.json({ message: 'Reported successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;