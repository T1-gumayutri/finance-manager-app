const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/auth.middleware');

// Gắn middleware protect để bắt buộc đăng nhập
router.get('/', protect, getDashboardStats);

module.exports = router;