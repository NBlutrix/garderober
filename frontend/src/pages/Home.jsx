import React from 'react';
import Layout from '../components/Layout';
import useAuth from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Wardrobe!</h1>
      {user ? (
        <p className="text-lg">Hello, {user.name}! Explore your items and outfits.</p>
      ) : (
        <p className="text-lg">Please login or register to start managing your wardrobe.</p>
      )}
    </Layout>
  );
};

export default Home;
