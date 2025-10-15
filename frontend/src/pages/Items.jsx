import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';

const Items = () => {
    const [items, setItems] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const res = await fetch('http://127.0.0.1:8000/api/items', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setItems(data);
    };

    return (
        <Layout>
            <h2 className="text-2xl mb-4">My Items</h2>
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
        </Layout>
    );
};

export default Items;
