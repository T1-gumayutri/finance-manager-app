const express = require('express');
const router = express.Router();

// THÊM updateTransaction VÀO DÒNG BÊN DƯỚI:
const { createTransaction, getTransactions, deleteTransaction, updateTransaction } = require('../controllers/transaction.controller');

const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.delete('/:id', deleteTransaction);
router.put('/:id', updateTransaction); // Dòng này giờ đã nhận diện được hàm

module.exports = router;