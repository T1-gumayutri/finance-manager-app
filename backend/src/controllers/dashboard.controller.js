const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// [GET] /api/dashboard - Lấy thống kê tháng hiện tại (hoặc tháng được truyền vào)
const getDashboardStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    
    // Mặc định lấy tháng và năm hiện tại nếu frontend không truyền lên
    const month = req.query.month ? parseInt(req.query.month) : new Date().getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

    // 1. Pipeline tính Tổng Thu và Tổng Chi
    const summaryPipeline = [
      {
        $match: {
          userId: userId,
          $expr: {
            $and: [
              { $eq: [{ $month: "$date" }, month] },
              { $eq: [{ $year: "$date" }, year] }
            ]
          }
        }
      },
      {
        $group: {
          _id: "$type", // Nhóm theo 'income' hoặc 'expense'
          totalAmount: { $sum: "$amount" } // Cộng dồn field 'amount'
        }
      }
    ];

    // 2. Pipeline thống kê chi tiêu theo Category (để vẽ biểu đồ tròn)
    const categoryPipeline = [
      {
        $match: {
          userId: userId,
          type: 'expense', // Chỉ thống kê khoản chi
          $expr: {
            $and: [
              { $eq: [{ $month: "$date" }, month] },
              { $eq: [{ $year: "$date" }, year] }
            ]
          }
        }
      },
      {
        $group: {
          _id: "$category", // Nhóm theo tên category (Ăn uống, Giải trí...)
          totalAmount: { $sum: "$amount" }
        }
      },
      { $sort: { totalAmount: -1 } } // Sắp xếp giảm dần để lấy top chi tiêu
    ];

    // Chạy song song 2 pipeline để tiết kiệm thời gian (Promise.all)
    const [summaryResult, categoryResult] = await Promise.all([
      Transaction.aggregate(summaryPipeline),
      Transaction.aggregate(categoryPipeline)
    ]);

    // Xử lý dữ liệu trả về cho Frontend dễ dùng
    let totalIncome = 0;
    let totalExpense = 0;

    summaryResult.forEach(item => {
      if (item._id === 'income') totalIncome = item.totalAmount;
      if (item._id === 'expense') totalExpense = item.totalAmount;
    });

    const balance = totalIncome - totalExpense;

    res.json({
      month,
      year,
      totalIncome,
      totalExpense,
      balance,
      categoryStats: categoryResult // [{ _id: 'Ăn uống', totalAmount: 500000 }, ...]
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu thống kê', error: error.message });
  }
};

module.exports = { getDashboardStats };