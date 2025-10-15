import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Items from './pages/Items';
import Outfits from './pages/Outfits';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/items" element={<Items />} />
                <Route path="/outfits" element={<Outfits />} />
            </Routes>
        </Router>
    );
};

export default App;
