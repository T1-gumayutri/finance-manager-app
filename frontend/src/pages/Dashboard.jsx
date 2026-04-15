import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State cho bộ lọc Tháng/Năm
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      
      const res = await api.get(`/dashboard?month=${filterMonth}&year=${filterYear}`);
      setStats(res.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchDashboardData();
  }, [filterMonth, filterYear]);

  if (loading && !stats) return <div className="mt-20 text-xl font-semibold text-center text-gray-500">Đang tải dữ liệu...</div>;
  if (!stats) return <div className="mt-20 text-center text-red-500">Không thể tải dữ liệu</div>;

  
  const barChartData = [
    { name: 'Thu nhập', amount: stats.totalIncome, fill: '#10b981' }, 
    { name: 'Chi tiêu', amount: stats.totalExpense, fill: '#ef4444' }  
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col items-center justify-between md:flex-row">
        <h2 className="text-3xl font-bold text-gray-800">
          Thống kê giao dịch
        </h2>
        
        
        <div className="flex mt-4 space-x-4 md:mt-0">
          <select 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-4 py-2 bg-white border rounded-lg shadow-sm focus:ring-blue-500"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>Tháng {m}</option>
            ))}
          </select>
          <select 
            value={filterYear} 
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-4 py-2 bg-white border rounded-lg shadow-sm focus:ring-blue-500"
          >
            {[2024, 2025, 2026].map(y => ( 
              <option key={y} value={y}>Năm {y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 Thẻ Tổng quan (Giữ nguyên cấu trúc) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-6 bg-white border-l-4 border-green-500 rounded-xl shadow-sm">
          <p className="text-sm font-semibold text-gray-500 uppercase">Tổng Thu Nhập</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.totalIncome.toLocaleString('vi-VN')} đ</p>
        </div>
        <div className="p-6 bg-white border-l-4 border-red-500 rounded-xl shadow-sm">
          <p className="text-sm font-semibold text-gray-500 uppercase">Tổng Chi Tiêu</p>
          <p className="mt-2 text-3xl font-bold text-red-600">{stats.totalExpense.toLocaleString('vi-VN')} đ</p>
        </div>
        <div className="p-6 bg-white border-l-4 border-blue-500 rounded-xl shadow-sm">
          <p className="text-sm font-semibold text-gray-500 uppercase">Chênh lệch (Số dư)</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.balance.toLocaleString('vi-VN')} đ</p>
        </div>
      </div>

      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <h3 className="mb-4 text-xl font-bold text-gray-700 text-center">So sánh Thu - Chi</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value) => `${value.toLocaleString('vi-VN')} đ`} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <h3 className="mb-4 text-xl font-bold text-gray-700 text-center">Danh mục chi tiêu</h3>
          {stats.categoryStats && stats.categoryStats.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryStats}
                    dataKey="totalAmount"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toLocaleString('vi-VN')} đ`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-500">
              Chưa có dữ liệu chi tiêu trong tháng này.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;