const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reviewController');

router.get('/', ctrl.getReviews);

module.exports = router;