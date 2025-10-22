import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../hooks/useAuth';
import InputField from '../components/InputField';
import Button from '../components/Button';

const Outfits = () => {
  const { token } = useAuth();
  const [outfits, setOutfits] = useState([]);
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('work'); // default lowercase
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage] = useState(10);

  const [itemPage, setItemPage] = useState(1);
  const [itemLastPage, setItemLastPage] = useState(1);

  // FETCH OUTFITS I ITEME
  useEffect(() => {
    if (!token) return;

    const fetchOutfits = async (page = 1) => {
      try {
        const res = await api.get(`/outfits?page=${page}&per_page=${perPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOutfits(res.data.data);
        setCurrentPage(res.data.current_page);
        setLastPage(res.data.last_page);
        setTotal(res.data.total);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch outfits.');
        setOutfits([]);
      }
    };

    const fetchItems = async (page = 1) => {
      try {
        const res = await api.get(`/items?page=${page}&per_page=${perPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = Array.isArray(res.data.data) ? res.data.data : res.data.data;
        setItems(data);
        setItemPage(res.data.current_page);
        setItemLastPage(res.data.last_page);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch items.');
        setItems([]);
      }
    };

    fetchItems();
    fetchOutfits();
  }, [token, perPage]);

  // KREIRANJE OUTFITA
  const handleCreateOutfit = async (e) => {
    e.preventDefault();
    if (!title.trim() || selectedItems.length === 0) {
      return setError('Please enter a title and select items.');
    }

    setLoading(true);

    // LOGUJEMO payload da proverimo vrednosti
    console.log({
      title,
      description,
      event_type: eventType,
      item_ids: selectedItems,
    });

    try {
      await api.post(
        '/outfits',
        {
          title,
          description,
          event_type: eventType, // uvek lowercase
          item_ids: selectedItems,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // RESETUJEMO FORMU
      setTitle('');
      setDescription('');
      setEventType('work');
      setSelectedItems([]);
      setError('');

      // osvežavamo prvu stranu outfita
      const res = await api.get(`/outfits?page=1&per_page=${perPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOutfits(res.data.data);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create outfit.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/outfits/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const res = await api.get(`/outfits?page=${currentPage}&per_page=${perPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOutfits(res.data.data);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete outfit.');
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const goToPage = async (page) => {
    if (page < 1 || page > lastPage) return;
    try {
      const res = await api.get(`/outfits?page=${page}&per_page=${perPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOutfits(res.data.data);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch outfits.');
    }
  };

  const goToItemPage = async (page) => {
    if (page < 1 || page > itemLastPage) return;
    try {
      const res = await api.get(`/items?page=${page}&per_page=${perPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data.data) ? res.data.data : res.data.data;
      setItems(data);
      setItemPage(res.data.current_page);
      setItemLastPage(res.data.last_page);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch items.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Outfits</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* CREATE OUTFIT FORM */}
      <form onSubmit={handleCreateOutfit} className="mb-6 p-6 bg-white rounded shadow-md space-y-4">
        <InputField
          label="Outfit Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter outfit title"
        />

        {/* Description */}
        <InputField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter outfit description"
        />

        {/* Event Type */}
        <p className="text-gray-700 font-semibold">Event Type:</p>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="border p-2 rounded mb-2 w-full"
        >
          <option value="work">Work</option>
          <option value="casual">Casual</option>
          <option value="party">Party</option>
          <option value="formal">Formal</option>
        </select>

        <p className="text-gray-700 font-semibold">Select Items:</p>
        <div className="border p-2 rounded">
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <label
                key={item.id}
                className="flex items-center space-x-2 bg-gray-100 p-2 rounded cursor-pointer hover:bg-gray-200"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleItemSelection(item.id)}
                />
                <span>{item.name}</span>
              </label>
            ))}
          </div>

          {/* Pagination za iteme */}
          <div className="flex justify-between mt-2">
            <Button disabled={itemPage === 1} onClick={() => goToItemPage(itemPage - 1)}>
              Previous
            </Button>
            <span className="text-gray-700">
              Page {itemPage} of {itemLastPage}
            </span>
            <Button disabled={itemPage === itemLastPage} onClick={() => goToItemPage(itemPage + 1)}>
              Next
            </Button>
          </div>
        </div>

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Creating...' : 'Create Outfit'}
        </Button>
      </form>

      {/* OUTFITS LIST */}
      <ul className="space-y-3">
        {outfits.length > 0 ? (
          outfits.map((outfit) => (
            <li
              key={outfit.id}
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{outfit.title}</p>
                <p className="text-gray-500">
                  Event: {outfit.event_type} | {outfit.description}
                </p>
                <p className="text-gray-500">{outfit.items?.map((i) => i.name).join(', ')}</p>
              </div>
              <Button onClick={() => handleDelete(outfit.id)} className="bg-red-500 hover:bg-red-600">
                Delete
              </Button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No outfits found.</p>
        )}
      </ul>

      {/* PAGINATION za outfite */}
      {outfits.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <Button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
            Previous
          </Button>

          <p className="text-gray-700">
            Page {currentPage} of {lastPage} ({total} total)
          </p>

          <Button disabled={currentPage === lastPage} onClick={() => goToPage(currentPage + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Outfits;
