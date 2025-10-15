import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => (
    <div>
        <nav className="bg-gray-800 text-white px-4 py-3">
            <ul className="flex space-x-4">
                <li><Link to="/items">Items</Link></li>
                <li><Link to="/outfits">Outfits</Link></li>
                <li><Link to="/login">Logout</Link></li>
            </ul>
        </nav>
        <main className="p-4">{children}</main>
    </div>
);

export default Layout;
