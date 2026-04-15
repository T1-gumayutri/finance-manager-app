const express = require('express');
const router = express.Router();
const { setBudget, getBudget } = require('../controllers/budget.controller');
const { protect } = require('../middlewares/auth.middleware');

// Gắn middleware bảo vệ route
router.use(protect);

router.post('/', setBudget); // Dùng POST cho cả tạo mới và cập nhật nhờ tính năng upsert
router.get('/', getBudget);

module.exports = router;