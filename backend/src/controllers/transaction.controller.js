const Transaction = require('../models/Transaction');


const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, note, date } = req.body;

    const transaction = await Transaction.create({
      userId: req.user._id, 
      type,
      amount,
      category,
      note,
      date: date || Date.now(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo giao dịch', error: error.message });
  }
};


const getTransactions = async (req, res) => {
  try {
    
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu', error: error.message });
  }
};


const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Không tìm thấy giao dịch!' });
    }

    
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Bạn không có quyền xóa giao dịch này!' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Xóa giao dịch thành công', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa', error: error.message });
  }
};
const updateTransaction = async (req, res) => {
  try {
    const { type, amount, category, note, date } = req.body;
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Không tìm thấy giao dịch!' });
    }

    
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Không có quyền chỉnh sửa!' });
    }

    
    transaction.type = type || transaction.type;
    transaction.amount = amount || transaction.amount;
    transaction.category = category || transaction.category;
    transaction.note = note || transaction.note;
    transaction.date = date || transaction.date;

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật', error: error.message });
  }
};

module.exports = { createTransaction, getTransactions, deleteTransaction, updateTransaction };