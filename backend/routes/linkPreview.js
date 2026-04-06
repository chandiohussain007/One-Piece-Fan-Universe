const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

router.get('/link-preview', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(data);

    const getMeta = (prop) =>
      $(`meta[property='${prop}']`).attr('content') ||
      $(`meta[name='${prop}']`).attr('content');

    res.json({
      title: getMeta('og:title') || $('title').text(),
      description: getMeta('og:description') || '',
      image: getMeta('og:image') || '',
      site: getMeta('og:site_name') || ''
    });

  } catch (err) {
    console.error(err.message);
    res.json({});
  }
});

module.exports = router; // ✅ THIS IS CRITICAL