const express = require('express');
const router = express.Router();
const { setBudget, getBudget } = require('../controllers/budget.controller');
const { protect } = require('../middlewares/auth.middleware');


router.use(protect);

router.post('/', setBudget); 
router.get('/', getBudget);

module.exports = router;