const express = require('express');
const MangaChapter = require('../models/MangaChapter');
const { auth, admin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for manga uploads (images + PDFs)
const mangaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/manga/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const mangaUpload = multer({
  storage: mangaStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for PDFs
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image\/(jpeg|jpg|png|gif)|application\/pdf/.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images and PDFs are allowed'));
  }
});

// Helper to determine file type
function getFileType(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ext === '.pdf' ? 'pdf' : 'image';
}

// Get all chapters (public)
router.get('/', async (req, res) => {
  try {
    const { limit = 100, animeName } = req.query;
    let query = { status: 'published' };
    if (animeName) query.animeName = animeName;

    const chapters = await MangaChapter.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json(chapters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get ALL chapters (including drafts)
router.get('/all', auth, admin, async (req, res) => {
  try {
    const chapters = await MangaChapter.find()
      .sort({ order: 1, createdAt: -1 });
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single chapter
router.get('/:id', async (req, res) => {
  try {
    const chapter = await MangaChapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    if (chapter.status !== 'published') {
      return res.status(403).json({ message: 'Chapter not available' });
    }

    chapter.views += 1;
    await chapter.save();

    res.json(chapter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Create chapter
router.post('/', auth, admin, mangaUpload.array('contentFiles', 30), async (req, res) => {
  try {
    const { title, description, animeName, type, externalLink, htmlEmbed, order, coverImage, status } = req.body;

    // Handle uploaded files - store as {url, fileType} objects
    const contentFiles = req.files
      ? req.files.map(file => ({
          url: `/uploads/manga/${file.filename}`,
          fileType: getFileType(file.filename)
        }))
      : [];

    const chapter = new MangaChapter({
      title,
      description: description || '',
      animeName: animeName || '',
      type: type || 'link',
      contentFiles,
      externalLink: externalLink || '',
      htmlEmbed: htmlEmbed || '',
      order: parseInt(order) || 0,
      coverImage: coverImage || '',
      status: status || 'draft'
    });

    await chapter.save();
    res.status(201).json(chapter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Admin: Update chapter
router.put('/:id', auth, admin, mangaUpload.array('contentFiles', 30), async (req, res) => {
  try {
    const chapter = await MangaChapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    const { title, description, animeName, type, externalLink, htmlEmbed, order, coverImage, status } = req.body;

    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map(file => ({
        url: `/uploads/manga/${file.filename}`,
        fileType: getFileType(file.filename)
      }));
      chapter.contentFiles = [...chapter.contentFiles, ...newFiles];
    }

    chapter.title = title || chapter.title;
    chapter.description = description !== undefined ? description : chapter.description;
    chapter.animeName = animeName !== undefined ? animeName : chapter.animeName;
    chapter.type = type || chapter.type;
    chapter.externalLink = externalLink !== undefined ? externalLink : chapter.externalLink;
    chapter.htmlEmbed = htmlEmbed !== undefined ? htmlEmbed : chapter.htmlEmbed;
    chapter.order = order !== undefined ? parseInt(order) : chapter.order;
    chapter.coverImage = coverImage !== undefined ? coverImage : chapter.coverImage;
    chapter.status = status || chapter.status;
    chapter.updatedAt = Date.now();

    await chapter.save();
    res.json(chapter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Admin: Delete chapter
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const chapter = await MangaChapter.findByIdAndDelete(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    res.json({ message: 'Chapter deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Remove a specific file from a chapter
router.delete('/:id/file/:fileIndex', auth, admin, async (req, res) => {
  try {
    const chapter = await MangaChapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    const fileIndex = parseInt(req.params.fileIndex);
    if (fileIndex >= 0 && fileIndex < chapter.contentFiles.length) {
      chapter.contentFiles.splice(fileIndex, 1);
      await chapter.save();
      res.json({ message: 'File removed', contentFiles: chapter.contentFiles });
    } else {
      res.status(400).json({ message: 'Invalid file index' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;