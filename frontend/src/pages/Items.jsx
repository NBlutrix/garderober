import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../hooks/useAuth';
import InputField from '../components/InputField';
import Button from '../components/Button';

const Items = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [season, setSeason] = useState('winter');
  const [color, setColor] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

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
    fetchItems();
  }, [token]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!name.trim() || !type.trim() || !season || !color.trim()) {
      return setError('All fields are required.');
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('season', season);
    formData.append('color', color);
    if (image) formData.append('image', image);

    try {
      const res = await api.post('/items', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setItems([...items, res.data]);
      setName('');
      setType('');
      setSeason('winter');
      setColor('');
      setImage(null);
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
      await api.delete(`/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

      <form
        onSubmit={handleAddItem}
        className="mb-6 space-y-4 bg-white p-6 rounded-lg shadow-md"
      >
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
        <div>
          <label className="block text-gray-700 mb-1">Season</label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="winter">Winter</option>
            <option value="autumn">Autumn</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
          </select>
        </div>
        <InputField
          label="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="Enter color"
        />
        <div>
          <label className="block text-gray-700 mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Item'}
        </Button>
      </form>

      <ul className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <li
              key={item.id}
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <div className="flex gap-4 items-center">
                {item.image_url && (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/storage/${item.image_url}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-500">{item.type}</p>
                  <p className="text-gray-500">Season: {item.season}</p>
                  <p className="text-gray-500">Color: {item.color}</p>
                </div>
              </div>
              <Button
                onClick={() => handleDelete(item.id)}
                className="bg-red-500 hover:bg-red-600"
              >
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
