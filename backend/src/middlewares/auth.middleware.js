const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Kiểm tra xem header Authorization có bắt đầu bằng chữ 'Bearer' không
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Tách lấy token từ chuỗi "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token để lấy payload (chứa id của user)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user trong DB và gán vào req.user (loại bỏ field password cho an toàn)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Cho phép đi tiếp vào Controller
    } catch (error) {
      res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Không có quyền truy cập, vui lòng đăng nhập!' });
  }
};

module.exports = { protect };