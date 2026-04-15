const Transaction = require('../models/Transaction');

// [POST] /api/transactions - Thêm giao dịch mới
const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, note, date } = req.body;

    const transaction = await Transaction.create({
      userId: req.user._id, // Lấy ID từ middleware protect truyền sang
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

// [GET] /api/transactions - Lấy danh sách giao dịch của user đang đăng nhập
const getTransactions = async (req, res) => {
  try {
    // Chỉ lấy giao dịch của user hiện tại, sắp xếp theo ngày mới nhất giảm dần (-1)
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu', error: error.message });
  }
};

// [DELETE] /api/transactions/:id - Xóa 1 giao dịch
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Không tìm thấy giao dịch!' });
    }

    // Đảm bảo chỉ người tạo ra giao dịch mới được quyền xóa
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

    // Đảm bảo chỉ chủ sở hữu mới được sửa
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Không có quyền chỉnh sửa!' });
    }

    // Cập nhật dữ liệu
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