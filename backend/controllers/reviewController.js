const https = require('https');

exports.getReviews = (req, res) => {
  const API_KEY  = process.env.GOOGLE_PLACES_API_KEY;
  const PLACE_ID = process.env.GOOGLE_PLACE_ID;

  if (!API_KEY || !PLACE_ID) {
    return res.status(400).json({ success: false, message: 'Missing API key or Place ID in .env' });
  }

  const url =
    'https://maps.googleapis.com/maps/api/place/details/json' +
    '?place_id=' + PLACE_ID +
    '&fields=name,rating,user_ratings_total,reviews' +
    '&reviews_sort=newest' +
    '&key=' + API_KEY;

  https.get(url, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      try {
        const json = JSON.parse(data);

        if (json.status !== 'OK') {
          console.error('Google Places error:', json.status, json.error_message || '');
          return res.status(500).json({ success: false, message: json.status });
        }

        const result = json.result;

        // Only return 4-star and above reviews
        const reviews = (result.reviews || [])
          .filter(r => r.rating >= 4)
          .map(r => ({
            author: r.author_name,
            rating: r.rating,
            text:   r.text,
            time:   r.relative_time_description,
            photo:  r.profile_photo_url,
          }));

        res.json({
          success: true,
          data: {
            name:         result.name,
            rating:       result.rating,
            totalRatings: result.user_ratings_total,
            reviews,
          },
        });

      } catch (err) {
        console.error('Parse error:', err.message);
        res.status(500).json({ success: false, message: 'Parse error: ' + err.message });
      }
    });
  }).on('error', (err) => {
    console.error('HTTPS error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  });
};