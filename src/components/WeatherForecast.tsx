import React, { useState } from "react";
import { fetchWeather } from "../services/weatherService";
import type { WeatherData } from "../services/weatherService";

const WeatherForecast: React.FC = () => {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setWeather(null);
    const result = await fetchWeather(location);
    if (result) {
      setWeather(result);
    } else {
      setError("Weather not found for this location.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Weather Forecast</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Enter location"
          style={{ width: "70%", padding: 8, marginRight: 8 }}
        />
        <button type="submit" style={{ padding: 8 }}>Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weather && (
        <div style={{ marginTop: 16 }}>
          <h3>{weather.location}</h3>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Description: {weather.description}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;
