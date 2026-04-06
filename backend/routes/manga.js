const express = require('express');
const MangaChapter = require('../models/MangaChapter');
const { auth, admin } = require('../middleware/auth');
const { syncMangaDex } = require('../utils/mangadexSync');

const router = express.Router();

// Get all chapters filtered by category
router.get('/', async (req, res) => {
  try {
    const { category, limit = 50, page = 1 } = req.query;
    let query = {};
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort by publishAt descending
    const chapters = await MangaChapter.find(query)
      .sort({ publishAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await MangaChapter.countDocuments(query);

    res.json({
      chapters,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Trigger Manual Sync
router.post('/sync', auth, admin, async (req, res) => {
  try {
    // Run sync asynchronously so we don't block the HTTP response
    syncMangaDex().catch(err => console.error("Sync failed:", err));
    res.json({ message: 'MangaDex sync started. This may take a few minutes.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Full Rebuild (Delete all and Sync)
router.post('/rebuild', auth, admin, async (req, res) => {
  try {
    await MangaChapter.deleteMany({});
    // Run sync asynchronously
    syncMangaDex().catch(err => console.error("Sync rebuild failed:", err));
    res.json({ message: 'All manga data cleared. Full MangaDex sync started.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single chapter details for reader
router.get('/:id', async (req, res) => {
  try {
    const chapter = await MangaChapter.findOne({ mangaDexChapterId: req.params.id });
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found in database' });
    }

    chapter.views += 1;
    await chapter.save();

    res.json(chapter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;