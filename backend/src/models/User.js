const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Vui lòng nhập tên'] 
    },
    email: { 
      type: String, 
      required: [true, 'Vui lòng nhập email'], 
      unique: true, 
      lowercase: true
    },
    password: { 
      type: String, 
      required: [true, 'Vui lòng nhập mật khẩu'] 
    },
    role: { 
      type: String, 
      enum: ['user', 'admin'], 
      default: 'user' 
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model('User', userSchema);


 