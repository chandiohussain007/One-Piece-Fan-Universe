const express = require('express');
const User = require('../models/User');
const FanArtPost = require('../models/FanArtPost');
const MangaChapter = require('../models/MangaChapter');
const Video = require('../models/Video');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// Apply admin middleware to all routes
router.use(auth, admin);

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const activeUsers = await User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30*24*60*60*1000) } });
    const newFanArtToday = await FanArtPost.countDocuments({
      createdAt: { $gte: new Date().setHours(0,0,0,0) }
    });
    const mangaChapters = await MangaChapter.countDocuments();
    const reportedContent = await FanArtPost.countDocuments({ reportedCount: { $gt: 0 } });
    
    res.json({
      activeUsers,
      newFanArtToday,
      mangaChapters,
      reportedContent
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role/ban status
router.put('/users/:id', async (req, res) => {
  try {
    const { role, isBanned } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isBanned },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all fan art posts (including pending)
router.get('/fanart', async (req, res) => {
  try {
    const posts = await FanArtPost.find()
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve fan art post
router.put('/fanart/:id/approve', async (req, res) => {
  try {
    const post = await FanArtPost.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject fan art post
router.put('/fanart/:id/reject', async (req, res) => {
  try {
    const post = await FanArtPost.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete fan art post
router.delete('/fanart/:id', async (req, res) => {
  try {
    await FanArtPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Recent user uploads (for dashboard)
router.get('/recent-uploads', async (req, res) => {
  try {
    const uploads = await FanArtPost.find()
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;