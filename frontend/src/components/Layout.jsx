import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav className="bg-gray-800 p-4 text-white flex justify-between">
        <div>
          <Link to="/" className="mr-4">Home</Link>
          {user && (
            <>
              <Link to="/items" className="mr-4">Items</Link>
              <Link to="/outfits" className="mr-4">Outfits</Link>
            </>
          )}
        </div>
        <div>
          {user ? (
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          ) : (
            <>
              <Link to="/login" className="mr-4">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
};

export default Layout;
