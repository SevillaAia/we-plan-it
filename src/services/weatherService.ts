// src/services/weatherService.ts
// Service to fetch weather data from OpenWeatherMap API

const API_KEY = "3c1f82a057d99781fe4437fdb472014d"; // Replace with your API key
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
