const express = require('express');
const router = express.Router();
const { getSmartInsights } = require('../controllers/insight.controller');
const { protect } = require('../middlewares/auth.middleware');

// API này chứa data nhạy cảm nên bắt buộc phải có token bảo vệ
router.get('/', protect, getSmartInsights);

module.exports = router;