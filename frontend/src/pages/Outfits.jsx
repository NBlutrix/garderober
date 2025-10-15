import React, { useState } from 'react';
import Card from '../components/Card';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import useFetch from '../hooks/useFetch';

const Outfits = () => {
  const { token } = useAuth();
  const { data: outfits, loading, error } = useFetch('http://127.0.0.1:8000/api/outfits', token);

  const [filterTitle, setFilterTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const outfitsPerPage = 4;

  // Filtriranje po naslovu
  const filteredOutfits = filterTitle
    ? outfits.filter(o => o.title.toLowerCase().includes(filterTitle.toLowerCase()))
    : outfits;

  // Paginacija
  const indexOfLast = currentPage * outfitsPerPage;
  const indexOfFirst = indexOfLast - outfitsPerPage;
  const currentOutfits = filteredOutfits.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOutfits.length / outfitsPerPage);

  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };
  const handlePrev = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };

  return (
    <Layout>
      <h2 className="text-2xl mb-4">My Outfits</h2>

      {/* Breadcrumbs */}
      <nav className="text-sm mb-4">
        <ol className="list-reset flex text-gray-600">
          <li>Home</li>
          <li className="mx-2">/</li>
          <li>Outfits</li>
        </ol>
      </nav>

      {/* Filter po naslovu */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by title..."
          value={filterTitle}
          onChange={(e) => { setFilterTitle(e.target.value); setCurrentPage(1); }}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentOutfits.map(outfit => (
          <Card key={outfit.id} title={outfit.title} subtitle={outfit.description}>
            {outfit.items && outfit.items.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {outfit.items.map(item => (
                  <div key={item.id} className="text-sm border p-1 rounded">
                    {item.name} ({item.type})
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between mt-4">
        <Button onClick={handlePrev} disabled={currentPage === 1}>Prev</Button>
        <p>Page {currentPage} of {totalPages}</p>
        <Button onClick={handleNext} disabled={currentPage === totalPages}>Next</Button>
      </div>
    </Layout>
  );
};

export default Outfits;
