const express = require('express');
const axios = require('axios');
const Video = require('../models/Video');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Add video
router.post('/', auth, admin, async (req, res) => {
  try {
    const { youtubeUrl } = req.body;
    
    // Extract YouTube ID
    const youtubeId = extractYouTubeId(youtubeUrl);
    if (!youtubeId) {
      return res.status(400).json({ message: 'Invalid YouTube URL' });
    }
    
    // Fetch video info using oEmbed
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`;
    const response = await axios.get(oembedUrl);
    const { title, thumbnail_url } = response.data;
    
    const video = new Video({
      title,
      youtubeId,
      thumbnail: thumbnail_url,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}`
    });
    
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete video
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

module.exports = router;