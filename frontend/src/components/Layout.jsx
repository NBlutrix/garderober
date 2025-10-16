import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout = ({ children }) => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-gray-800 p-4 text-white flex justify-between items-center shadow-md">
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-gray-300 font-semibold">Home</Link>
          {token && (
            <>
              <Link to="/items" className="hover:text-gray-300 font-semibold">Items</Link>
              <Link to="/outfits" className="hover:text-gray-300 font-semibold">Outfits</Link>
            </>
          )}
        </div>
        <div className="flex space-x-4">
          {token ? (
            <button 
              onClick={handleLogout} 
              className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
