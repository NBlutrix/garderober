import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Layout from '../components/Layout';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { useAuth } from '../hooks/useAuth';

const Outfits = () => {
    const [outfits, setOutfits] = useState([]);
    const [items, setItems] = useState([]); // Za dropdown selekciju itema
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [newOutfit, setNewOutfit] = useState({
        title: '',
        description: '',
        item_ids: []
    });

    const { token } = useAuth();

    useEffect(() => {
        fetchOutfits();
        fetchItems();
    }, []);

    const fetchOutfits = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/api/outfits', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setOutfits(data);
        } catch (err) {
            setError('Failed to fetch outfits');
        }
        setLoading(false);
    };

    const fetchItems = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/items', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error('Failed to fetch items for outfit creation');
        }
    };

    const handleChange = e => {
        const { name, value, options } = e.target;
        if (name === 'item_ids') {
            const selectedIds = Array.from(options)
                .filter(option => option.selected)
                .map(option => parseInt(option.value));
            setNewOutfit(prev => ({ ...prev, item_ids: selectedIds }));
        } else {
            setNewOutfit(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/api/outfits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newOutfit)
            });
            if (!res.ok) throw new Error('Failed to add outfit');
            const addedOutfit = await res.json();
            setOutfits(prev => [...prev, addedOutfit]);
            setNewOutfit({ title: '', description: '', item_ids: [] });
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <Layout>
            <h2 className="text-2xl mb-4">My Outfits</h2>

            {/* Forma za dodavanje outfita */}
            <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50">
                <InputField
                    label="Title"
                    name="title"
                    value={newOutfit.title}
                    onChange={handleChange}
                    placeholder="Outfit title"
                />
                <InputField
                    label="Description"
                    name="description"
                    value={newOutfit.description}
                    onChange={handleChange}
                    placeholder="Description"
                />
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Select Items</label>
                    <select
                        name="item_ids"
                        multiple
                        value={newOutfit.item_ids}
                        onChange={handleChange}
                        className="border rounded px-3 py-2 w-full h-32"
                    >
                        {items.map(item => (
                            <option key={item.id} value={item.id}>
                                {item.name} ({item.type})
                            </option>
                        ))}
                    </select>
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Outfit'}
                </Button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>

            {/* Lista outfita */}
            {loading && !outfits.length ? (
                <p>Loading outfits...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {outfits.map(outfit => (
                        <Card
                            key={outfit.id}
                            title={outfit.title}
                            subtitle={outfit.description}
                        >
                            <p>Items:</p>
                            <ul className="list-disc ml-5">
                                {outfit.items.map(item => (
                                    <li key={item.id}>
                                        {item.name} ({item.type})
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default Outfits;
