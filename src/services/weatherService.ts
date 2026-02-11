// src/services/weatherService.ts
// Service to fetch weather data from OpenWeatherMap API

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export interface WeatherData {
  location: string;
  temperature: number;
  description: string;
}

export async function fetchWeather(location: string): Promise<WeatherData | null> {
  try {
    const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      location: data.name,
      temperature: data.main.temp,
      description: data.weather[0]?.description || "",
    };
  } catch (error) {
    return null;
  }
}
