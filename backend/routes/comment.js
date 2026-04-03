const express = require('express');
const Comment = require('../models/Comment');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get comments for a target
router.get('/:targetType/:targetId', async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const comments = await Comment.find({
      targetType,
      targetId,
      parent: null
    })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    
    // Get replies for each comment
    const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
      const replies = await Comment.find({ parent: comment._id })
        .populate('user', 'username avatar')
        .sort({ createdAt: 1 });
      return { ...comment.toObject(), replies };
    }));
    
    res.json(commentsWithReplies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create comment
router.post('/', auth, async (req, res) => {
  try {
    const { targetType, targetId, content, parentId } = req.body;
    
    const comment = new Comment({
      user: req.user._id,
      targetType,
      targetId,
      content,
      parent: parentId || null
    });
    
    await comment.save();
    await comment.populate('user', 'username avatar');
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user owns comment or is admin
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Comment.deleteMany({ $or: [{ _id: comment._id }, { parent: comment._id }] });
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;