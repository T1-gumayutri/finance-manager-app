const express = require('express');
const router = express.Router();


const { createTransaction, getTransactions, deleteTransaction, updateTransaction } = require('../controllers/transaction.controller');

const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.delete('/:id', deleteTransaction);
router.put('/:id', updateTransaction); 

module.exports = router;