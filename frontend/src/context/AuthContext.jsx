import { createContext, useState, useEffect } from 'react';

// Khởi tạo Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chạy 1 lần khi load app: Kiểm tra xem user đã đăng nhập trước đó chưa
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Hoàn thành việc kiểm tra
  }, []);

  // Hàm xử lý đăng nhập thành công (Lưu token và data)
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Hàm xử lý đăng xuất (Xóa token và data)
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* Chỉ render các component con khi đã kiểm tra xong token để tránh nháy giật giao diện */}
      {!loading && children}
    </AuthContext.Provider>
  );
};