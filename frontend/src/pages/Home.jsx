import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Wardrobe!</h1>
      {user ? (
        <p className="text-lg">Hello, {user.name}! Explore your items and outfits.</p>
      ) : (
        <p className="text-lg">Please login or register to start managing your wardrobe.</p>
      )}
    </div>
  );
};

export default Home;
