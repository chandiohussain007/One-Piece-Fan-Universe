const mongoose = require('mongoose');
require('dotenv').config();

async function clearManga() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const MangaChapter = require('./models/MangaChapter');
    await MangaChapter.deleteMany({});
    console.log('All manga chapters deleted from database.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
clearManga();
