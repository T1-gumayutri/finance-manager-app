const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');


const getDashboardStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    
    
    const month = req.query.month ? parseInt(req.query.month) : new Date().getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

    
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
          _id: "$type", 
          totalAmount: { $sum: "$amount" } 
        }
      }
    ];

    
    const categoryPipeline = [
      {
        $match: {
          userId: userId,
          type: 'expense', 
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
          _id: "$category", 
          totalAmount: { $sum: "$amount" }
        }
      },
      { $sort: { totalAmount: -1 } } 
    ];

    
    const [summaryResult, categoryResult] = await Promise.all([
      Transaction.aggregate(summaryPipeline),
      Transaction.aggregate(categoryPipeline)
    ]);

    
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
      categoryStats: categoryResult 
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu thống kê', error: error.message });
  }
};

module.exports = { getDashboardStats };