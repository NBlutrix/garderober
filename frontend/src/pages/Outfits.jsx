import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import InputField from '../components/InputField';
import Button from '../components/Button';

const Outfits = () => {
  const { token, user } = useAuth();
  const [outfits, setOutfits] = useState([]);
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    const fetchOutfits = async () => {
      try {
        const res = await api.get('/outfits', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOutfits(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch outfits.');
      }
    };

    const fetchItems = async () => {
      try {
        const res = await api.get('/items', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch items.');
      }
    };

    fetchOutfits();
    fetchItems();
  }, [token]); // samo token je dependency

  const handleCreateOutfit = async (e) => {
    e.preventDefault();
    if (!title.trim() || selectedItems.length === 0)
      return setError('Please enter a title and select at least one item.');

    try {
      const res = await api.post(
        '/outfits',
        { title, item_ids: selectedItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOutfits([...outfits, res.data]);
      setTitle('');
      setSelectedItems([]);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create outfit.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/outfits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOutfits(outfits.filter((o) => o.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete outfit.');
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  if (!user) {
    return (
      <Layout>
        <p className="text-center text-gray-600">
          You must be logged in to view outfits.
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="text-2xl mb-4">Outfits</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleCreateOutfit} className="max-w-md mb-6">
        <InputField
          label="Outfit Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter outfit title"
        />

        <p className="mb-2 text-gray-700">Select Items:</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {items.map((item) => (
            <label key={item.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleItemSelection(item.id)}
              />
              <span>{item.name}</span>
            </label>
          ))}
        </div>

        <Button type="submit">Create Outfit</Button>
      </form>

      <ul className="space-y-2">
        {outfits.length > 0 ? (
          outfits.map((outfit) => (
            <li
              key={outfit.id}
              className="p-3 border rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{outfit.title}</p>
                <p className="text-sm text-gray-500">
                  {outfit.items && outfit.items.map((i) => i.name).join(', ')}
                </p>
              </div>
              <Button
                onClick={() => handleDelete(outfit.id)}
                className="bg-red-500"
              >
                Delete
              </Button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No outfits found.</p>
        )}
      </ul>
    </Layout>
  );
};

export default Outfits;
