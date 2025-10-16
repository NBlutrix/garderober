import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../hooks/useAuth';
import InputField from '../components/InputField';
import Button from '../components/Button';

const OutfitPlanner = () => {
  const { token } = useAuth();
  const [city, setCity] = useState('Belgrade');
  const [temperature, setTemperature] = useState(null);
  const [eventType, setEventType] = useState('');
  const [suggestedOutfits, setSuggestedOutfits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch weather
  const fetchWeather = async () => {
    try {
      const res = await api.get(`/weather?city=${city}`);
      setTemperature(res.data.main.temp);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch weather.');
    }
  };

  // Fetch suggested outfits
  const fetchSuggestedOutfits = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get(
        `/outfits/suggest?event_type=${eventType}&temperature=${temperature}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuggestedOutfits(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch suggested outfits.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [city]);

  useEffect(() => {
    if (temperature !== null && eventType) {
      fetchSuggestedOutfits();
    }
    // eslint-disable-next-line
  }, [temperature, eventType]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Outfit Planner</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-6 space-y-4 bg-white p-6 rounded-lg shadow-md">
        <InputField
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <InputField
          label="Event Type"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          placeholder="Enter event type (e.g., party, casual)"
        />
        <Button onClick={fetchSuggestedOutfits} disabled={loading}>
          {loading ? 'Fetching...' : 'Get Outfit Suggestions'}
        </Button>
      </div>

      {temperature !== null && (
        <p className="mb-4 text-gray-700">
          Current temperature in {city}: <span className="font-semibold">{temperature}°C</span>
        </p>
      )}

      <div className="space-y-4">
        {suggestedOutfits.length > 0 ? (
          suggestedOutfits.map((outfit) => (
            <div
              key={outfit.id}
              className="border p-4 rounded shadow bg-white"
            >
              <h3 className="font-semibold text-lg mb-2">{outfit.title}</h3>
              {outfit.description && <p className="text-gray-600 mb-2">{outfit.description}</p>}
              {outfit.event_type && (
                <p className="text-sm text-gray-500 mb-2">Event Type: {outfit.event_type}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {outfit.items.map((item) => (
                  <div
                    key={item.id}
                    className="border p-2 rounded shadow text-sm"
                  >
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-500">{item.type}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No outfit suggestions yet.</p>
        )}
      </div>
    </div>
  );
};

export default OutfitPlanner;
