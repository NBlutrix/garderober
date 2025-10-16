import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import InputField from '../components/InputField';
import Button from '../components/Button';

const Items = () => {
  const { token, user } = useAuth();
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch items
  useEffect(() => {
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

    if (token) fetchItems();
  }, [token]);

  // Add item
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!name.trim() || !category.trim()) return setError('All fields required.');

    setLoading(true);
    try {
      const res = await api.post(
        '/items',
        { name, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems([...items, res.data]);
      setName('');
      setCategory('');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to add item.');
    } finally {
      setLoading(false);
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    try {
      await api.delete(`/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete item.');
    }
  };

  if (!user) {
    return (
      <Layout>
        <p className="text-center text-gray-600">You must be logged in to view items.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="text-2xl mb-4">Items</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleAddItem} className="max-w-sm mb-6">
        <InputField
          label="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter item name"
        />
        <InputField
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Item'}
        </Button>
      </form>

      <ul className="space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <li
              key={item.id}
              className="p-3 border rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
              <Button onClick={() => handleDelete(item.id)} className="bg-red-500">
                Delete
              </Button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No items found.</p>
        )}
      </ul>
    </Layout>
  );
};

export default Items;
