const express = require('express');
const router = express.Router();
const { getSmartInsights } = require('../controllers/insight.controller');
const { protect } = require('../middlewares/auth.middleware');


router.get('/', protect, getSmartInsights);

module.exports = router;