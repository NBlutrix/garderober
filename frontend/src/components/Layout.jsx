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
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          {token && (
            <>
              <Link to="/items" className="hover:underline">Items</Link>
              <Link to="/outfits" className="hover:underline">Outfits</Link>
            </>
          )}
        </div>
        <div className="flex space-x-4">
          {token ? (
            <button 
              onClick={handleLogout} 
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </nav>
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
};

export default Layout;
