import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../hooks/useAuth';
import InputField from '../components/InputField';
import Button from '../components/Button';

const Items = () => {
  const { token,} = useAuth();
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchItems = async () => {
      try {
        const res = await api.get('/items', { headers: { Authorization: `Bearer ${token}` } });
        setItems(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch items.');
      }
    };
    fetchItems();
  }, [token]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!name.trim() || !type.trim()) return setError('All fields required.');

    setLoading(true);
    try {
      const res = await api.post(
        '/items',
        { name, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems([...items, res.data]);
      setName('');
      setType('');
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add item.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/items/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete item.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Items</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleAddItem} className="mb-6 space-y-4 bg-white p-6 rounded-lg shadow-md">
        <InputField
          label="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter item name"
        />
        <InputField
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Enter item type"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Item'}
        </Button>
      </form>

      <ul className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-500">{item.type}</p>
              </div>
              <Button onClick={() => handleDelete(item.id)} className="bg-red-500 hover:bg-red-600">
                Delete
              </Button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No items found.</p>
        )}
      </ul>
    </div>
  );
};

export default Items;
