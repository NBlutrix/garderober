import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Items from './pages/Items';
import Outfits from './pages/Outfits';
import OutfitPlanner from './pages/OutfitPlanner'; // <-- dodaj ovo
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const { token, loading } = useAuth();

  if (loading) return <div className="text-center mt-20 text-xl">Loading...</div>;

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Zaštićene rute */}
          <Route path="/items" element={token ? <Items /> : <Navigate to="/login" />} />
          <Route path="/outfits" element={token ? <Outfits /> : <Navigate to="/login" />} />
          <Route path="/planner" element={token ? <OutfitPlanner /> : <Navigate to="/login" />} /> {/* nova ruta */}

          {/* Javne rute */}
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/items" />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/items" />} />

          {/* Fallback ruta */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
