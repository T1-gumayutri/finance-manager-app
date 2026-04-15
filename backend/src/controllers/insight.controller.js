const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const mongoose = require('mongoose');

const getSmartInsights = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    
    const threeMonthsAgoDate = new Date(currentYear, currentMonth - 4, 1);

    
    const aggregationResult = await Transaction.aggregate([
      { $match: { userId: userId, type: 'expense', date: { $gte: threeMonthsAgoDate } } },
      {
        $facet: {
          currentMonthCategories: [
            { $match: { $expr: { $and: [{ $eq: [{ $month: "$date" }, currentMonth] }, { $eq: [{ $year: "$date" }, currentYear] }] } } },
            { $group: { _id: "$category", total: { $sum: "$amount" } } },
            { $sort: { total: -1 } }
          ],
          pastMonthsTotal: [
            { $match: { $expr: { $or: [{ $ne: [{ $month: "$date" }, currentMonth] }, { $ne: [{ $year: "$date" }, currentYear] }] } } },
            { $group: { _id: { month: { $month: "$date" }, year: { $year: "$date" } }, total: { $sum: "$amount" } } }
          ]
        }
      }
    ]);

    const currentMonthCategories = aggregationResult[0].currentMonthCategories;
    const pastMonthsTotal = aggregationResult[0].pastMonthsTotal;
    const currentMonthTotalExpense = currentMonthCategories.reduce((sum, cat) => sum + cat.total, 0);

    
    const [budgetDoc, incomeTotalResult] = await Promise.all([
      Budget.findOne({ userId, month: currentMonth, year: currentYear }),
      Transaction.aggregate([
        { $match: { userId, type: 'income', $expr: { $and: [{ $eq: [{ $month: "$date" }, currentMonth] }, { $eq: [{ $year: "$date" }, currentYear] }] } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    const budgetAmount = budgetDoc ? budgetDoc.amount : 0;
    const totalIncome = incomeTotalResult.length > 0 ? incomeTotalResult[0].total : 0;

    
    const pastTotal = pastMonthsTotal.reduce((sum, m) => sum + m.total, 0);
    const pastAvg = pastMonthsTotal.length > 0 ? pastTotal / pastMonthsTotal.length : 0;
    
    let trendPercentage = 0;
    let trendWarning = false;
    if (pastAvg > 0) {
      trendPercentage = ((currentMonthTotalExpense - pastAvg) / pastAvg) * 100;
      if (trendPercentage > 20) trendWarning = true;
    }

    
    let savingSuggestion = null;
    if (currentMonthCategories.length > 0) {
      const topCategory = currentMonthCategories[0];
      const topCategoryPercentage = (topCategory.total / currentMonthTotalExpense) * 100;
      
      if (topCategoryPercentage > 40) {
        savingSuggestion = `Khoản "${topCategory._id}" đang chiếm tới ${topCategoryPercentage.toFixed(1)}% tổng chi tiêu. Khuyến nghị giảm tần suất chi tiêu cho khoản này để cân đối tài chính.`;
      }
    }

    
    const daysPassed = today.getDate(); 
    const totalDaysInMonth = new Date(currentYear, currentMonth, 0).getDate(); 
    
    const predictedExpense = daysPassed > 0 ? (currentMonthTotalExpense / daysPassed) * totalDaysInMonth : 0;
    const isPredictedOverBudget = budgetAmount > 0 && predictedExpense > budgetAmount;

    
    let healthScore = 100;
    const scoreExplanations = [];

    
    const savingsRate = totalIncome > 0 ? ((totalIncome - currentMonthTotalExpense) / totalIncome) * 100 : 0;
    if (savingsRate < 0) {
      healthScore -= 30;
      scoreExplanations.push("-30 điểm: Bạn đang chi tiêu vượt mức thu nhập (Âm tiền).");
    } else if (savingsRate < 20) {
      healthScore -= 10;
      scoreExplanations.push("-10 điểm: Tỷ lệ tiết kiệm dưới 20% thu nhập (Chưa đạt chuẩn an toàn).");
    } else {
      scoreExplanations.push("+ Tỷ lệ tiết kiệm tốt (>= 20%).");
    }

    
    if (trendWarning) {
      healthScore -= 15;
      scoreExplanations.push(`-15 điểm: Chi tiêu tháng này tăng đột biến ${trendPercentage.toFixed(1)}% so với trung bình các tháng trước.`);
    }

    
    if (budgetAmount > 0) {
      if (currentMonthTotalExpense > budgetAmount) {
        healthScore -= 20;
        scoreExplanations.push("-20 điểm: Bạn đã phá vỡ ngân sách đặt ra cho tháng này.");
      } else if (currentMonthTotalExpense <= budgetAmount * 0.8) {
        
        healthScore = Math.min(100, healthScore + 5); 
        scoreExplanations.push("+5 điểm thưởng: Quản lý ngân sách xuất sắc (chi tiêu dưới 80% hạn mức).");
      }
    } else {
      healthScore -= 5;
      scoreExplanations.push("-5 điểm: Chưa thiết lập mục tiêu ngân sách (Budget) cho tháng này.");
    }

    
    res.json({
      trend: {
        pastAverage: Math.round(pastAvg),
        currentExpense: currentMonthTotalExpense,
        percentageChange: Number(trendPercentage.toFixed(2)),
        isWarning: trendWarning,
        message: trendWarning ? "Chi tiêu đang tăng nguy hiểm!" : "Chi tiêu đang ở mức kiểm soát."
      },
      suggestion: savingSuggestion || "Cơ cấu chi tiêu hiện tại đang khá cân đối, không có hạng mục nào chiếm tỷ trọng quá lớn.",
      prediction: {
        currentDaysPassed: daysPassed,
        estimatedEndOfMonth: Math.round(predictedExpense),
        isWarning: isPredictedOverBudget,
        message: isPredictedOverBudget 
          ? `Cảnh báo: Tốc độ tiêu tiền hiện tại sẽ khiến bạn tiêu tốn ${Math.round(predictedExpense).toLocaleString('vi-VN')}đ cuối tháng, vượt qua ngân sách!`
          : "Tốc độ chi tiêu an toàn."
      },
      health: {
        score: Math.max(0, healthScore), 
        explanations: scoreExplanations
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi phân tích dữ liệu', error: error.message });
  }
};

module.exports = { getSmartInsights };