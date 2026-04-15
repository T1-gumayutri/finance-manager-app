const Budget = require('../models/Budget');

// [POST] /api/budgets - Đặt hoặc Cập nhật ngân sách cho 1 tháng
const setBudget = async (req, res) => {
  try {
    const { month, year, amount } = req.body;

    // Tìm xem tháng/năm này user đã đặt ngân sách chưa. 
    // Nếu có rồi thì update amount, nếu chưa có thì tự động tạo mới (upsert: true)
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user._id, month, year }, // Điều kiện tìm kiếm
      { amount },                            // Dữ liệu cập nhật
      { new: true, upsert: true }            // Trả về dữ liệu mới nhất, cho phép tạo mới
    );

    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lưu ngân sách', error: error.message });
  }
};

// [GET] /api/budgets - Lấy ngân sách của tháng/năm cụ thể
const getBudget = async (req, res) => {
  try {
    const month = req.query.month ? parseInt(req.query.month) : new Date().getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

    const budget = await Budget.findOne({ 
      userId: req.user._id, 
      month, 
      year 
    });

    if (!budget) {
      // Trả về mặc định 0 nếu user chưa đặt ngân sách cho tháng này
      return res.json({ amount: 0, month, year });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy ngân sách', error: error.message });
  }
};

module.exports = { setBudget, getBudget };