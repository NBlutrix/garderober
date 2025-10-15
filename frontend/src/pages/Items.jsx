import React, { useState } from 'react';
import Card from '../components/Card';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import useFetch from '../hooks/useFetch';

const Items = () => {
  const { token } = useAuth();
  const { data: items, loading, error } = useFetch('http://127.0.0.1:8000/api/items', token);

  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filtriranje po tipu
  const filteredItems = filterType
    ? items.filter(item => item.type.toLowerCase() === filterType.toLowerCase())
    : items;

  // Paginacija
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <Layout>
      <h2 className="text-2xl mb-4">My Items</h2>

      <div className="mb-4">
        <select
          className="border rounded px-3 py-2"
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
        >
          <option value="">All Types</option>
          <option value="shirt">Shirts</option>
          <option value="pants">Pants</option>
          <option value="shoes">Shoes</option>
          <option value="jacket">Jackets</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentItems.map(item => (
          <Card
            key={item.id}
            title={item.name}
            subtitle={`${item.type} - ${item.season}`}
            image={item.image_url}
          >
            <p>Color: {item.color}</p>
            <p>Warmth: {item.warmth}</p>
            <p>Waterproof: {item.waterproof ? 'Yes' : 'No'}</p>
          </Card>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <Button onClick={handlePrev} disabled={currentPage === 1}>Prev</Button>
        <p>Page {currentPage} of {totalPages}</p>
        <Button onClick={handleNext} disabled={currentPage === totalPages}>Next</Button>
      </div>
    </Layout>
  );
};

export default Items;
