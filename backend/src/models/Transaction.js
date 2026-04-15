const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    type: { 
      type: String, 
      enum: ['income', 'expense'], 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true, 
      min: [0, 'Số tiền không hợp lệ'] 
    },
    category: { 
      type: String, 
      required: true 
    },
    note: { 
      type: String,
      default: ''
    },
    date: { 
      type: Date, 
      required: true, 
      default: Date.now 
    },
  },
  { timestamps: true }
);


transactionSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);