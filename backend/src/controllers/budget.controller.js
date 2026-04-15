const Budget = require('../models/Budget');


const setBudget = async (req, res) => {
  try {
    const { month, year, amount } = req.body;

    
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user._id, month, year }, 
      { amount },                            
      { new: true, upsert: true }            
    );

    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lưu ngân sách', error: error.message });
  }
};


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
      
      return res.json({ amount: 0, month, year });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy ngân sách', error: error.message });
  }
};

module.exports = { setBudget, getBudget };