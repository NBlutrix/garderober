import React, { useState } from 'react';
import axios from 'axios';
import ItemCard from '../components/ItemCard'; // komponenta za prikaz itema
import Button from '../components/Button';

const OutfitPlanner = () => {
  const [city, setCity] = useState('Belgrade');
  const [eventType, setEventType] = useState('');
  const [temperature, setTemperature] = useState(null);
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSuggest = async () => {
    setError('');
    setLoading(true);
    setOutfits([]);

    try {
      // 1️⃣ Dohvati temperaturu sa Weather API-ja
      const weatherRes = await axios.get(`/api/weather?city=${city}`);
      const temp = weatherRes.data.main.temp;
      setTemperature(temp);

      // 2️⃣ Dohvati predloge outfita na osnovu temperature i event_type
      const outfitsRes = await axios.get(
        `/api/outfits/suggest?temperature=${temp}&event_type=${eventType}`,
        { withCredentials: true } // ako koristiš sanctum
      );

      setOutfits(outfitsRes.data);
    } catch (err) {
      console.error(err);
      setError('Greška pri dohvatanju podataka.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Outfit Planner</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="Grad"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3"
        />
        <input
          type="text"
          placeholder="Tip događaja (casual, formal...)"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3"
        />
        <Button onClick={handleSuggest} disabled={loading}>
          {loading ? 'Predlažem...' : 'Predloži Outfit'}
        </Button>
      </div>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {temperature !== null && (
        <p className="mb-4 text-center">
          Temperatura u {city}: {temperature}°C
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {outfits.map((outfit) => (
          <div
            key={outfit.id}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <h2 className="font-semibold text-lg mb-2">{outfit.title}</h2>
            <p className="text-sm mb-2">{outfit.description}</p>
            <div className="flex flex-wrap gap-2">
              {outfit.items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutfitPlanner;
