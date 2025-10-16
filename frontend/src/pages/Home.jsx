import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto text-center mt-20">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to Your Wardrobe!</h1>
      {user ? (
        <p className="text-xl text-gray-600">Hello, {user.name}! Explore your items and outfits.</p>
      ) : (
        <p className="text-xl text-gray-600">Please login or register to start managing your wardrobe.</p>
      )}
    </div>
  );
};

export default Home;
