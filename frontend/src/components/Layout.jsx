import { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar (Menu bên trái) */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">FinanceApp</h1>
          <p className="mt-1 text-sm text-gray-500">Xin chào, <span className="font-semibold text-gray-700">{user?.name}</span></p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link to="/" className="block px-4 py-3 text-gray-700 transition rounded-lg hover:bg-blue-50 hover:text-blue-600">
            📊 Dashboard
          </Link>
          <Link to="/transactions" className="block px-4 py-3 text-gray-700 transition rounded-lg hover:bg-blue-50 hover:text-blue-600">
            💰 Giao dịch
          </Link>
          {/* Nơi đây sau này có thể thêm menu Ngân sách */}
          {/* THÊM DÒNG NÀY VÀO */}
          <Link to="/budget" className="block px-4 py-3 text-gray-700 transition rounded-lg hover:bg-blue-50 hover:text-blue-600">
            🎯 Ngân sách
          </Link>
          <Link to="/insights" className="block px-4 py-3 font-medium text-purple-700 transition bg-purple-50 rounded-lg hover:bg-purple-100">
            🧠 Cố vấn AI
          </Link>
        </nav>

        <div className="p-4 border-t">
          <button 
            onClick={handleLogout} 
            className="w-full px-4 py-2 text-left text-red-600 transition rounded-lg hover:bg-red-50"
          >
            🚪 Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content (Khu vực hiển thị nội dung chính bên phải) */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet /> {/* Các trang Dashboard, Transactions sẽ được render tại đây */}
      </main>
    </div>
  );
};

export default Layout;