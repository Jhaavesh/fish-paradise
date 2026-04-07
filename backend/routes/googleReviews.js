// server/routes/reviews.js
const express = require('express');
const router  = express.Router();

const CACHE_TTL = 30 * 60 * 1000;
let cache = { data: null, ts: 0 };

router.get('/', async (req, res) => {
  try {
    if (cache.data && Date.now() - cache.ts < CACHE_TTL) {
      return res.json({ success: true, data: cache.data });
    }

    const API_KEY  = process.env.GOOGLE_PLACES_API_KEY;
    const PLACE_ID = process.env.GOOGLE_PLACE_ID;

    if (!API_KEY || !PLACE_ID || PLACE_ID === API_KEY || !PLACE_ID.startsWith('ChIJ')) {
      console.warn('[reviews] GOOGLE_PLACE_ID not configured correctly.');
      return res.json({ success: false, reason: 'not_configured' });
    }

    const fields = 'displayName,rating,userRatingCount,reviews';
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=${fields}&key=${API_KEY}&languageCode=en`;

    const response = await fetch(url);

    if (!response.ok) {
      const errText = await response.text();
      console.error('[reviews] Google API error:', response.status, errText);
      return res.json({ success: false, reason: 'api_error' });
    }

    const place = await response.json();

    if (!place || place.error) {
      return res.json({ success: false, reason: 'api_error' });
    }

    const reviews = (place.reviews || []).map((r) => ({
      author : r.authorAttribution?.displayName || 'Anonymous',
      photo  : r.authorAttribution?.photoUri    || null,
      rating : r.rating || 5,
      text   : r.text?.text || '',
      time   : r.relativePublishTimeDescription || '',
    }));

    const data = {
      rating      : place.rating         || 5,
      totalRatings: place.userRatingCount || 0,
      reviews,
    };

    cache = { data, ts: Date.now() };
    return res.json({ success: true, data });

  } catch (err) {
    console.error('[reviews] Error:', err.message);
    return res.json({ success: false, reason: 'server_error' });
  }
});

module.exports = router;