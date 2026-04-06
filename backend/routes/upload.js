const express = require('express');
const multer = require('multer');
const path = require('path');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// --- Manga Storage (images + PDFs) ---
const mangaStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/manga/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const mangaUpload = multer({
  storage: mangaStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image\/(jpeg|jpg|png|gif)|application\/pdf/.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only images and PDFs are allowed'));
  }
});

// --- FanArt Storage (images + videos) ---
const fanartStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/fanart/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fanartUpload = multer({
  storage: fanartStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for videos
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image\/(jpeg|jpg|png|gif)|video\/(mp4|webm|quicktime)/.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only images and videos are allowed'));
  }
});

// Upload manga cover image
router.post('/manga', auth, admin, mangaUpload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const fileUrl = `/uploads/manga/${req.file.filename}`;
    res.json({ fileUrl });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Upload single manga PDF or image
router.post('/manga-pdf', auth, admin, mangaUpload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const ext = path.extname(req.file.filename).toLowerCase();
    const fileUrl = `/uploads/manga/${req.file.filename}`;
    const fileType = ext === '.pdf' ? 'pdf' : 'image';
    res.json({ fileUrl, fileType });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Upload fanart
router.post('/fanart', auth, fanartUpload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const fileUrl = `/uploads/fanart/${req.file.filename}`;
    res.json({ fileUrl });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;