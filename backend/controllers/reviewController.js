const https = require('https');

exports.getReviews = (req, res) => {
  const API_KEY  = process.env.GOOGLE_PLACES_API_KEY;
  const PLACE_ID = process.env.GOOGLE_PLACE_ID;

  if (!API_KEY || !PLACE_ID) {
    return res.status(400).json({
      success: false,
      message: 'Missing API key or Place ID'
    });
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,user_ratings_total,reviews&key=${API_KEY}`;

  https.get(url, (apiRes) => {
    let data = '';

    apiRes.on('data', chunk => data += chunk);

    apiRes.on('end', () => {
      try {
        const json = JSON.parse(data);

        if (json.status !== 'OK') {
          return res.status(500).json({
            success: false,
            message: json.status
          });
        }

        const result = json.result;

        res.json({
          success: true,
          data: {
            name: result.name,
            rating: result.rating,
            totalRatings: result.user_ratings_total,
            reviews: result.reviews || []
          }
        });

      } catch (err) {
        res.status(500).json({
          success: false,
          message: 'Parse error'
        });
      }
    });

  }).on('error', (err) => {
    res.status(500).json({
      success: false,
      message: err.message
    });
  });
};