const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Load biến môi trường từ file .env
dotenv.config();

// Khởi tạo app Express
const app = express();

// Middleware
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Để đọc được body JSON gửi lên từ Client
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/transactions', require('./src/routes/transaction.routes'));
app.use('/api/dashboard', require('./src/routes/dashboard.routes'));
app.use('/api/budgets', require('./src/routes/budget.routes'));
app.use('/api/insights', require('./src/routes/insight.routes')); // <--- THÊM DÒNG NÀY
// Kết nối Database
connectDB();

// Route test cơ bản
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server đang chạy ở port ${PORT}`);
});