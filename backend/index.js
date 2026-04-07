const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const connectDB = require('./config/db');

/* ✅ DEBUG (already correct) */
console.log("PLACE_ID:", process.env.GOOGLE_PLACE_ID);
console.log("API_KEY:", process.env.GOOGLE_PLACES_API_KEY ? "Loaded" : "Missing");

connectDB();
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ✅ EXISTING ROUTES */
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/contact',  require('./routes/contactRoutes'));
app.use('/api/gallery',  require('./routes/galleryRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));

/* ✅ GOOGLE REVIEWS ROUTE (ALREADY PRESENT - KEEP SAME) */
app.use('/api/reviews',  require('./routes/reviewRoutes'));

/* ✅ ADD THIS (optional but useful debug route) */
app.get('/api/google-check', (req, res) => {
  res.json({
    placeId: process.env.GOOGLE_PLACE_ID,
    apiKeyLoaded: !!process.env.GOOGLE_PLACES_API_KEY
  });
});

app.get('/api/health', (req, res) => res.json({ status: 'OK', env: process.env.NODE_ENV }));
app.get('/api/config',  (req, res) => res.json({
  waGroupLink: process.env.WA_GROUP_LINK || '',
  waNumber:    process.env.WA_NUMBER    || '919886198869',
}));

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT));