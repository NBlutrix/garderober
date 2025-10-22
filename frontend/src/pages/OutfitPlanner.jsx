import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../hooks/useAuth';
import InputField from '../components/InputField';


const OutfitPlanner = () => {
  const { token } = useAuth();
  const [city, setCity] = useState('Belgrade');
  const [temperature, setTemperature] = useState(null);
  const [eventType, setEventType] = useState('');
  const [suggestedOutfits, setSuggestedOutfits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch weather direktno u useEffect da uklonimo ESLint warning
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await api.get(`/weather?city=${city}`);
        const temp = parseFloat(res.data.main.temp);
        setTemperature(temp);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch weather.');
      }
    };

    fetchWeather();
  }, [city]); // dependency je samo city

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
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Event Type</label>
          <select
           value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select event type</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="party">Party</option>
            <option value="work">Work</option>
          </select>
            </div>
       {loading && <p className="text-gray-500">Loading outfit suggestions...</p>}
      </div>

      {temperature !== null && (
        <p className="mb-4 text-gray-700">
          Current temperature in {city}: <span className="font-semibold">{temperature}°C</span>
        </p>
      )}

      <div className="space-y-4">
        {suggestedOutfits.length > 0 ? (
          suggestedOutfits.map((outfit) => (
            <div key={outfit.id} className="border p-4 rounded shadow bg-white">
              <h3 className="font-semibold text-lg mb-2">{outfit.title}</h3>
              {outfit.description && <p className="text-gray-600 mb-2">{outfit.description}</p>}
              {outfit.event_type && (
                <p className="text-sm text-gray-500 mb-2">Event Type: {outfit.event_type}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {outfit.items.map((item) => (
                  <div key={item.id} className="border p-2 rounded shadow text-sm">
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
