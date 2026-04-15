import { useState, useEffect } from 'react';
import api from '../services/api';

const Budget = () => {
  const [budgetAmount, setBudgetAmount] = useState(0);
  const [currentExpense, setCurrentExpense] = useState(0);
  const [inputAmount, setInputAmount] = useState('');
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu ngày hiện tại
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const fetchData = async () => {
    try {
      // Chạy song song 2 API để tối ưu tốc độ tải
      const [budgetRes, dashboardRes] = await Promise.all([
        api.get('/budgets'),
        api.get('/dashboard')
      ]);

      setBudgetAmount(budgetRes.data.amount || 0);
      setInputAmount(budgetRes.data.amount || '');
      setCurrentExpense(dashboardRes.data.totalExpense || 0);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu ngân sách:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets', {
        month: currentMonth,
        year: currentYear,
        amount: Number(inputAmount)
      });
      setBudgetAmount(Number(inputAmount));
      alert('Cập nhật ngân sách thành công!');
    } catch (error) {
      alert('Lỗi khi cập nhật ngân sách!');
      console.error(error);
    }
  };

  if (loading) return <div className="mt-10 text-center text-gray-500">Đang tải dữ liệu...</div>;

  // Tính toán phần trăm chi tiêu để vẽ Progress Bar
  const percent = budgetAmount > 0 ? Math.min((currentExpense / budgetAmount) * 100, 100) : 0;
  const isOverBudget = currentExpense > budgetAmount && budgetAmount > 0;

  // Đổi màu thanh tiến trình dựa trên mức độ chi tiêu
  let progressBarColor = 'bg-green-500';
  if (percent > 80) progressBarColor = 'bg-red-500';
  else if (percent > 50) progressBarColor = 'bg-yellow-500';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">
        Ngân sách tháng {currentMonth}/{currentYear}
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Cột trái: Form thiết lập ngân sách */}
        <div className="p-6 bg-white shadow-sm rounded-xl h-fit">
          <h3 className="mb-4 text-xl font-bold text-gray-700">Thiết lập giới hạn chi tiêu</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ngân sách tối đa (VNĐ)</label>
              <input 
                type="number" 
                required 
                min="0" 
                value={inputAmount} 
                onChange={(e) => setInputAmount(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500" 
                placeholder="VD: 5000000" 
              />
            </div>
            <button type="submit" className="w-full py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Lưu Ngân Sách
            </button>
          </form>
        </div>

        {/* Cột phải: Thống kê trạng thái ngân sách */}
        <div className="p-6 bg-white shadow-sm rounded-xl">
          <h3 className="mb-4 text-xl font-bold text-gray-700">Tình trạng hiện tại</h3>
          
          {budgetAmount === 0 ? (
            <p className="text-gray-500">Bạn chưa thiết lập ngân sách cho tháng này.</p>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between text-lg font-semibold text-gray-700">
                <span>Đã chi: <span className="text-red-600">{currentExpense.toLocaleString('vi-VN')} đ</span></span>
                <span>/ {budgetAmount.toLocaleString('vi-VN')} đ</span>
              </div>

              {/* Progress Bar (Thanh tiến trình) */}
              <div className="w-full h-4 bg-gray-200 rounded-full">
                <div 
                  className={`h-4 rounded-full transition-all duration-500 ${progressBarColor}`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>

              {/* Thông báo cảnh báo */}
              {isOverBudget ? (
                <div className="p-3 font-semibold text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
                  ⚠️ Cảnh báo: Bạn đã chi tiêu vượt mức ngân sách!
                </div>
              ) : (
                <p className="text-gray-600">
                  Bạn còn lại <span className="font-bold text-green-600">{(budgetAmount - currentExpense).toLocaleString('vi-VN')} đ</span> để chi tiêu.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Budget;