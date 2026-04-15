import { useState, useEffect } from 'react';
import api from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Ăn uống',
    note: '',
    date: new Date().toISOString().split('T')[0] 
  });

  const expenseCategories = ['Ăn uống', 'Mua sắm', 'Di chuyển', 'Giải trí', 'Hóa đơn', 'Khác'];
  const incomeCategories = ['Tiền lương', 'Đầu tư', 'Thưởng', 'Khác'];

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (error) {
      console.error('Lỗi khi lấy giao dịch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'type') {
        newData.category = value === 'expense' ? expenseCategories[0] : incomeCategories[0];
      }
      return newData;
    });
  };

  
  const handleEditClick = (transaction) => {
    setEditingId(transaction._id);
    setFormData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      note: transaction.note || '',
      date: new Date(transaction.date).toISOString().split('T')[0] // Format chuẩn để hiện lên input date
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      type: 'expense',
      amount: '',
      category: 'Ăn uống',
      note: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
       
        await api.put(`/transactions/${editingId}`, formData);
        alert('Cập nhật giao dịch thành công!');
        setEditingId(null); 
      } else {
        
        await api.post('/transactions', formData);
        alert('Thêm giao dịch thành công!');
      }
      
      
      setFormData(prev => ({ ...prev, amount: '', note: '' }));
      fetchTransactions();
    } catch (error) {
      alert(editingId ? 'Lỗi khi cập nhật!' : 'Lỗi khi thêm giao dịch!');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
      try {
        await api.delete(`/transactions/${id}`);
        setTransactions(transactions.filter(t => t._id !== id));
      } catch (error) {
        alert('Lỗi khi xóa!');
      }
    }
  };

  if (loading) return <div className="mt-10 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 animate-fade-in">
     
      <div className={`p-6 bg-white shadow-sm md:col-span-1 rounded-xl h-fit border-t-4 ${editingId ? 'border-yellow-400' : 'border-blue-500'}`}>
        <h3 className="mb-4 text-xl font-bold text-gray-800">
          {editingId ? '✏️ Cập nhật Giao Dịch' : '➕ Thêm Giao Dịch'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Loại giao dịch</label>
            <select name="type" value={formData.type} onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:ring-blue-500">
              <option value="expense">Chi tiêu (-)</option>
              <option value="income">Thu nhập (+)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Số tiền (VNĐ)</label>
            <input type="number" name="amount" required min="0" value={formData.amount} onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:ring-blue-500" placeholder="VD: 50000" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Danh mục</label>
            <select name="category" value={formData.category} onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:ring-blue-500">
              {(formData.type === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày</label>
            <input type="date" name="date" required value={formData.date} onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ghi chú (Tùy chọn)</label>
            <input type="text" name="note" value={formData.note} onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:ring-blue-500" placeholder="Mua đồ ăn sáng..." />
          </div>

          <div className="flex space-x-2">
            <button type="submit" className={`flex-1 py-2 font-bold text-white rounded-lg ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {editingId ? 'Lưu Thay Đổi' : 'Lưu Giao Dịch'}
            </button>
            
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="flex-1 py-2 font-bold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      
      <div className="p-6 bg-white shadow-sm md:col-span-2 rounded-xl">
        <h3 className="mb-4 text-xl font-bold text-gray-800">Lịch sử giao dịch</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500">Chưa có giao dịch nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 font-semibold text-gray-600">Ngày</th>
                  <th className="p-3 font-semibold text-gray-600">Danh mục</th>
                  <th className="p-3 font-semibold text-gray-600">Ghi chú</th>
                  <th className="p-3 font-semibold text-right text-gray-600">Số tiền</th>
                  <th className="p-3 font-semibold text-center text-gray-600">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t._id} className={`border-b hover:bg-gray-50 transition ${editingId === t._id ? 'bg-yellow-50' : ''}`}>
                    <td className="p-3 text-gray-800 whitespace-nowrap">{new Date(t.date).toLocaleDateString('vi-VN')}</td>
                    <td className="p-3 text-gray-800">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {t.category}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600 max-w-[150px] truncate" title={t.note}>{t.note}</td>
                    <td className={`p-3 text-right font-bold whitespace-nowrap ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <button onClick={() => handleEditClick(t)} className="mr-3 text-blue-500 hover:text-blue-700">
                        ✏️ Sửa
                      </button>
                      <button onClick={() => handleDelete(t._id)} className="text-red-500 hover:text-red-700">
                        🗑️ Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;