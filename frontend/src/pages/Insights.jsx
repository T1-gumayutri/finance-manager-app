import { useState, useEffect } from 'react';
import api from '../services/api';

const Insights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.get('/insights');
        setInsights(res.data);
      } catch (err) {
        setError('Không thể tải dữ liệu phân tích. Hãy đảm bảo bạn đã có dữ liệu giao dịch.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) return <div className="mt-20 text-xl font-semibold text-center text-gray-500">🧠 Đang phân tích dữ liệu tài chính của bạn...</div>;
  if (error) return <div className="mt-20 text-center text-red-500">{error}</div>;
  if (!insights) return null;

  // Xác định màu sắc cho Điểm Sức Khỏe (Health Score)
  let scoreColor = 'text-green-600';
  let scoreBg = 'bg-green-100';
  if (insights.health.score < 50) {
    scoreColor = 'text-red-600';
    scoreBg = 'bg-red-100';
  } else if (insights.health.score < 80) {
    scoreColor = 'text-yellow-600';
    scoreBg = 'bg-yellow-100';
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">🧠 Cố vấn Tài chính AI</h2>
        <p className="mt-2 text-gray-600">Dựa trên thuật toán phân tích hành vi chi tiêu của bạn.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* 1️⃣ Điểm Sức Khỏe Tài Chính (Nổi bật nhất) */}
        <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 shadow-sm rounded-2xl lg:col-span-1">
          <h3 className="text-lg font-bold text-gray-700">Điểm Sức Khỏe Tài Chính</h3>
          <div className={`mt-6 flex items-center justify-center w-40 h-40 rounded-full ${scoreBg} border-8 border-white shadow-inner`}>
            <span className={`text-5xl font-extrabold ${scoreColor}`}>
              {insights.health.score}
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-500">Thang điểm 100</p>
        </div>

        {/* Chi tiết trừ/cộng điểm */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl lg:col-span-2">
          <h3 className="mb-4 text-lg font-bold text-gray-700">Phân tích điểm số:</h3>
          <ul className="space-y-3">
            {insights.health.explanations.map((exp, index) => (
              <li key={index} className="flex items-start">
                <span className={`mr-2 font-bold ${exp.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                  {exp.startsWith('-') ? '❌' : '✅'}
                </span>
                <span className="text-gray-700">{exp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* 2️⃣ Xu hướng chi tiêu */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <h3 className="flex items-center text-lg font-bold text-gray-700">
            📈 Xu hướng chi tiêu
          </h3>
          <div className="mt-4">
            <p className="text-sm text-gray-500">So với trung bình 3 tháng trước:</p>
            <div className="flex items-baseline mt-2 space-x-2">
              <span className={`text-3xl font-bold ${insights.trend.isWarning ? 'text-red-600' : 'text-green-600'}`}>
                {insights.trend.percentageChange > 0 ? '+' : ''}{insights.trend.percentageChange}%
              </span>
            </div>
            <p className={`mt-2 text-sm font-medium ${insights.trend.isWarning ? 'text-red-500' : 'text-green-500'}`}>
              {insights.trend.message}
            </p>
          </div>
        </div>

        {/* 3️⃣ Dự đoán chi tiêu */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <h3 className="flex items-center text-lg font-bold text-gray-700">
            🔮 Dự đoán cuối tháng
          </h3>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Ước tính tiêu hao (Dựa trên {insights.prediction.currentDaysPassed} ngày):</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {insights.prediction.estimatedEndOfMonth.toLocaleString('vi-VN')} đ
            </p>
            <p className={`mt-2 text-sm font-medium ${insights.prediction.isWarning ? 'text-red-500' : 'text-blue-500'}`}>
              {insights.prediction.message}
            </p>
          </div>
        </div>

        {/* 4️⃣ Gợi ý tiết kiệm */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <h3 className="flex items-center text-lg font-bold text-gray-700">
            💡 Gợi ý tối ưu
          </h3>
          <p className="mt-4 leading-relaxed text-gray-700">
            {insights.suggestion}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Insights;