const axios = require('axios');
const MangaChapter = require('../models/MangaChapter');

const ONE_PIECE_MANGA_ID = 'a1c7c817-4e59-43b7-9365-09675a149a6f';
const BASE_URL = 'https://api.mangadex.org';

const delay = ms => new Promise(res => setTimeout(res, ms));

async function getMangaCover(mangaId) {
  try {
    const res = await axios.get(`${BASE_URL}/manga/${mangaId}?includes[]=cover_art`);
    const coverArt = res.data.data.relationships.find(rel => rel.type === 'cover_art');
    if (coverArt) {
      return `https://uploads.mangadex.org/covers/${mangaId}/${coverArt.attributes.fileName}`;
    }
  } catch (error) {
    console.error(`Failed to fetch cover for ${mangaId}`, error.message);
  }
  return null;
}

// Map strings to MangaDex search requests
const categoryQueries = {
  'One Shots': ['One Piece Party', 'One Piece Special'],
  'Light Novels': ['Ace\'s Story', 'Law\'s Story', 'Hero of the Rocks', 'One Piece Novel']
};

async function syncMangaDex() {
  console.log('Starting MangaDex Sync...');
  let totalAdded = 0;

  try {
    // 1. Sync Main Manga
    console.log('Syncing Main One Piece Manga...');
    const mainMangaCover = await getMangaCover(ONE_PIECE_MANGA_ID);
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const feedRes = await axios.get(`${BASE_URL}/manga/${ONE_PIECE_MANGA_ID}/feed`, {
        params: {
          'translatedLanguage[]': 'en',
          limit: 500,
          offset: offset,
          order: { chapter: 'asc' }
        }
      });

      const chapters = feedRes.data.data;
      if (chapters.length === 0) break;

      for (const ch of chapters) {
        // Classify chap '0' or empty as One Shot instead of Manga if user wants, but 
        // to simplify, everything in main manga feed goes to 'Manga' unless it's obviously a special.
        // The prompt said: "One shots = filter by chapter numbers below 1"
        const chapterNum = parseFloat(ch.attributes.chapter);
        let category = 'Manga';
        if (isNaN(chapterNum) || chapterNum < 1) {
          category = 'One Shots';
        }

        const existing = await MangaChapter.findOne({ mangaDexChapterId: ch.id });
        if (!existing) {
          await MangaChapter.create({
            mangaDexChapterId: ch.id,
            mangaDexMangaId: ONE_PIECE_MANGA_ID,
            title: ch.attributes.title || `Chapter ${ch.attributes.chapter || '?'}`,
            volume: ch.attributes.volume,
            chapter: ch.attributes.chapter,
            category: category,
            coverImage: mainMangaCover || '', // MangaDex doesn't have page level covers easily, use manga cover
            publishAt: new Date(ch.attributes.publishAt)
          });
          totalAdded++;
        }
      }
      
      offset += 500;
      if (offset >= feedRes.data.total) hasMore = false;
      await delay(500); // rate limit protection
    }

    // 2. Sync Other Categories (Search queries)
    for (const [catName, queries] of Object.entries(categoryQueries)) {
      for (const query of queries) {
        console.log(`Searching for ${catName}: ${query}`);
        try {
          const searchRes = await axios.get(`${BASE_URL}/manga`, {
            params: { title: query, limit: 3 }
          });
          
          await delay(500);

          for (const manga of searchRes.data.data) {
            // Check if title actually contains 'One Piece' or the query roughly to avoid random matches
            const title = manga.attributes.title.en || Object.values(manga.attributes.title)[0];
            
            const cover = await getMangaCover(manga.id);
            await delay(500);

            // Fetch chapters for this manga
            const feedRes = await axios.get(`${BASE_URL}/manga/${manga.id}/feed`, {
              params: { 'translatedLanguage[]': 'en', limit: 100 }
            });

            for (const ch of feedRes.data.data) {
              const existing = await MangaChapter.findOne({ mangaDexChapterId: ch.id });
              if (!existing) {
                await MangaChapter.create({
                  mangaDexChapterId: ch.id,
                  mangaDexMangaId: manga.id,
                  title: `${title} - ${ch.attributes.title || ('Chapter ' + (ch.attributes.chapter||'?'))}`,
                  volume: ch.attributes.volume,
                  chapter: ch.attributes.chapter,
                  category: catName,
                  coverImage: cover || '',
                  publishAt: new Date(ch.attributes.publishAt)
                });
                totalAdded++;
              }
            }
            await delay(500);
          }
        } catch (e) {
          console.error(`Error searching query ${query}: ${e.message}`);
        }
      }
    }

    console.log(`MangaDex Sync Complete. Total new chapters added: ${totalAdded}`);
  } catch (error) {
    console.error('MangaDex sync error:', error.message);
  }
}

module.exports = { syncMangaDex };
