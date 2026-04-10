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
const { syncMangaDex } = require('./utils/mangadexSync');

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

// CORS - allow your frontend and localhost 
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      if (process.env.NODE_ENV === 'development') {
        return callback(null, true); // Permissive in dev
      }
      return callback(null, false); // Just return false instead of throwing error to prevent crash
    }
    return callback(null, true);
  },
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
  .then(() => {
    console.log('Connected to MongoDB');
    // Start initial sync and then every 6 hours (21600000 ms)
    setTimeout(() => {
      syncMangaDex().catch(err => console.error("Initial sync failed:", err));
    }, 5000); // Wait 5 seconds after boot to sync
    
    setInterval(() => {
      syncMangaDex().catch(err => console.error("Scheduled sync failed:", err));
    }, 6 * 60 * 60 * 1000);
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Dynamic port for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
