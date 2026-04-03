const express = require('express');
const AnimeLink = require('../models/AnimeLink');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// Get all anime links grouped by anime
router.get('/', async (req, res) => {
  try {
    const links = await AnimeLink.find().sort({ animeTitle: 1, episodeNumber: 1 });
    
    // Group by anime title
    const grouped = links.reduce((acc, link) => {
      if (!acc[link.animeTitle]) {
        acc[link.animeTitle] = [];
      }
      acc[link.animeTitle].push(link);
      return acc;
    }, {});
    
    res.json(grouped);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Add anime link
router.post('/', auth, admin, async (req, res) => {
  try {
    const { animeTitle, episodeNumber, link } = req.body;
    const animeLink = new AnimeLink({ animeTitle, episodeNumber, link });
    await animeLink.save();
    res.status(201).json(animeLink);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update anime link
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const animeLink = await AnimeLink.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!animeLink) {
      return res.status(404).json({ message: 'Link not found' });
    }
    res.json(animeLink);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete anime link
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    await AnimeLink.findByIdAndDelete(req.params.id);
    res.json({ message: 'Link deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;