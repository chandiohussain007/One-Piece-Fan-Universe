const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const mangaRoutes = require('./routes/manga');
const fanArtRoutes = require('./routes/fanArt');
const videoRoutes = require('./routes/video');
const animeLinkRoutes = require('./routes/animeLink');
const commentRoutes = require('./routes/comment');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');
const linkPreviewRoutes = require('./routes/linkPreview');

const app = express();

// 🔥 Render proxy fix
app.set('trust proxy', 1); // MUST be before rate limiter

// Security middleware
app.use(helmet());

// Rate limiting - apply to all /api routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - allow your frontend only
app.use(cors({
  origin: process.env.CLIENT_URL, // read from env
  credentials: true
}));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/manga', mangaRoutes);
app.use('/api/fanart', fanArtRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/animelinks', animeLinkRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', linkPreviewRoutes);

// Test API route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is alive!' });
});

// Health check for Render
app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Dynamic port for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
