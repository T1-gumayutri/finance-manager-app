# 💰 Finance Manager App (Ứng dụng Quản lý Tài chính)

Một ứng dụng quản lý tài chính cá nhân toàn diện giúp người dùng dễ dàng ghi chép giao dịch thu/chi, quản lý ngân sách và theo dõi "sức khỏe" tài chính thông qua các phân tích thông minh và biểu đồ trực quan.

---

## 🌟 Tính năng nổi bật

- **🔐 Xác thực bảo mật:** Đăng ký và đăng nhập an toàn sử dụng JSON Web Token (JWT) và mã hóa mật khẩu bằng Bcrypt.
- **📊 Bảng điều khiển (Dashboard) trực quan:**
  - Cung cấp cái nhìn tổng quan về **Tổng Thu**, **Tổng Chi** và **Số Dư**.
  - Hỗ trợ biểu đồ cột (Bar Chart) so sánh thu/chi và biểu đồ tròn (Pie Chart) thống kê chi tiêu theo danh mục.
  - Bộ lọc dữ liệu linh hoạt theo Tháng và Năm.
- **📝 Quản lý giao dịch:**
  - Thêm, sửa, xóa các giao dịch thu nhập và chi tiêu.
  - Phân loại rõ ràng theo từng danh mục (Ăn uống, Mua sắm, Tiền lương,...).
- **💡 Phân tích thông minh (Smart Insights):**
  - Tính toán và chấm điểm sức khỏe tài chính dựa trên thói quen thu chi.
  - Đưa ra cảnh báo nếu có dấu hiệu chi tiêu quá tay hoặc vượt hạn mức ngân sách (Budget).
  - Đề xuất các giải pháp tiết kiệm hợp lý dựa vào danh mục chi tiêu tốn kém nhất.

---

## 🛠 Công nghệ sử dụng (Tech Stack)

Dự án được xây dựng trên nền tảng **MERN Stack** kết hợp các công cụ hiện đại:

**Frontend:**
- [React.js](https://react.dev/) + [Vite](https://vitejs.dev/) - Tối ưu hóa tốc độ build và trải nghiệm mượt mà.
- [Tailwind CSS](https://tailwindcss.com/) - Thiết kế giao diện (UI) hiện đại, responsive.
- [Recharts](https://recharts.org/) - Thư viện biểu đồ dữ liệu mạnh mẽ.

**Backend:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) - Xử lý logic và API.
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) - Cơ sở dữ liệu NoSQL lưu trữ giao dịch và tài khoản.
- [JWT (JSON Web Tokens)](https://jwt.io/) - Xác thực phiên người dùng.

**DevOps & Triển khai:**
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) - Đóng gói và chạy toàn bộ hệ thống bằng một dòng lệnh.

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### Cách 1: Sử dụng Docker (Khuyến nghị)

Với Docker, bạn không cần cài đặt Node.js hay MongoDB cục bộ. Tất cả đã được đóng gói sẵn.

**Yêu cầu:** Đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/).

1. Clone dự án về máy:
   ```bash
   git clone https://github.com/T1-gumayutri/finance-manager-app.git
   cd finance-manager-app
   ```

2. Khởi chạy toàn bộ hệ thống bằng Docker Compose:
   ```bash
   docker-compose up --build -d
   ```
   *Lệnh này sẽ khởi động 3 containers: `finance_mongo`, `finance_backend`, và `finance_frontend`.*

3. Trải nghiệm ứng dụng:
   - Frontend: Truy cập http://localhost
   - Backend API: Đang chạy tại `http://localhost:5000`
   - MongoDB: Đang chạy tại cổng `27017`

---

### Cách 2: Chạy cục bộ (Local Development)

**Yêu cầu:** Đã cài đặt Node.js (v18+) và MongoDB đang chạy cục bộ (port `27017`).

**Bước 1: Chạy Backend**
1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Tạo file `.env` từ file mẫu (hoặc đảm bảo có các biến sau):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/finance_manager
   JWT_SECRET=finance_manager_secret_key_2026_!@#
   ```
4. Khởi chạy server:
   ```bash
   npm run dev # hoặc npm start
   ```

**Bước 2: Chạy Frontend**
1. Di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi chạy Vite server:
   ```bash
   npm run dev
   ```
4. Ứng dụng Frontend sẽ có mặt tại URL được Vite cấp (thường là `http://localhost:5173`).

---

## 📁 Cấu trúc thư mục (Project Structure)

```text
finance-manager-app/
├── backend/                   # Mã nguồn Node.js/Express
│   ├── src/
│   │   ├── controllers/       # Logic xử lý API (auth, transactions, insight...)
│   │   ├── models/            # Mongoose Schema (User, Transaction, Budget...)
│   │   ├── routes/            # Khai báo Express Routers
│   │   └── ...
│   ├── Dockerfile             # File build image cho backend
│   └── package.json
├── frontend/                  # Mã nguồn React + Vite
│   ├── src/
│   │   ├── components/        # Các UI Components tái sử dụng
│   │   ├── pages/             # Các trang (Dashboard, Transactions, Login...)
│   │   ├── services/          # Chứa cấu hình gọi API (Axios...)
│   │   └── ...
│   ├── Dockerfile             # File build image cho frontend (thường kết hợp Nginx)
│   ├── tailwind.config.js     # Cấu hình TailwindCSS
│   └── package.json
└── docker-compose.yml         # File thiết lập toàn bộ môi trường Docker
```

---

## 📜 Giấy phép (License)
Dự án này là mã nguồn mở, bạn có thể tự do sao chép và chỉnh sửa tùy ý.
