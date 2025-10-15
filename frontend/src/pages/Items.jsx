import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Layout from '../components/Layout';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { useAuth } from '../hooks/useAuth';

const Items = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [newItem, setNewItem] = useState({
        name: '',
        type: '',
        season: '',
        warmth: '',
        waterproof: false,
        color: '',
        image_url: ''
    });

    const { token } = useAuth();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/api/items', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setItems(data);
        } catch (err) {
            setError('Failed to fetch items');
        }
        setLoading(false);
    };

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setNewItem(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newItem)
            });
            if (!res.ok) throw new Error('Failed to add item');
            const addedItem = await res.json();
            setItems(prev => [...prev, addedItem]);
            setNewItem({
                name: '',
                type: '',
                season: '',
                warmth: '',
                waterproof: false,
                color: '',
                image_url: ''
            });
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <Layout>
            <h2 className="text-2xl mb-4">My Items</h2>

            {/* Forma za dodavanje novog itema */}
            <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50">
                <InputField
                    label="Name"
                    name="name"
                    value={newItem.name}
                    onChange={handleChange}
                    placeholder="Item name"
                />
                <InputField
                    label="Type"
                    name="type"
                    value={newItem.type}
                    onChange={handleChange}
                    placeholder="Item type"
                />
                <InputField
                    label="Season"
                    name="season"
                    value={newItem.season}
                    onChange={handleChange}
                    placeholder="Season"
                />
                <InputField
                    label="Warmth"
                    name="warmth"
                    type="number"
                    value={newItem.warmth}
                    onChange={handleChange}
                    placeholder="Warmth level"
                />
                <div className="mb-4">
                    <label className="mr-2">
                        <input
                            type="checkbox"
                            name="waterproof"
                            checked={newItem.waterproof}
                            onChange={handleChange}
                        />{' '}
                        Waterproof
                    </label>
                </div>
                <InputField
                    label="Color"
                    name="color"
                    value={newItem.color}
                    onChange={handleChange}
                    placeholder="Color"
                />
                <InputField
                    label="Image URL"
                    name="image_url"
                    value={newItem.image_url}
                    onChange={handleChange}
                    placeholder="Image URL"
                />
                <Button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Item'}
                </Button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>

            {/* Lista itema */}
            {loading && !items.length ? (
                <p>Loading items...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {items.map(item => (
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
            )}
        </Layout>
    );
};

export default Items;
