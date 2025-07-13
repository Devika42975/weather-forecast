import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('Hyderabad');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = "d7aa93a06672a9120716d142a5026396";

  const fetchWeather = useCallback(() => {
    setLoading(true);
    setError('');
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        if (data.cod === "200") {
          setWeatherData(data);
        } else {
          setError("City not found");
          setWeatherData(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch data");
        setLoading(false);
        setWeatherData(null);
      });
  }, [city]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const getFiveDayForecast = (list) => {
    const dailyMap = new Map();

    list.forEach(item => {
      const date = item.dt_txt.split(' ')[0]; // e.g., "2025-07-13"
      const time = item.dt_txt.split(' ')[1]; // e.g., "12:00:00"
      if (time === "12:00:00" && !dailyMap.has(date)) {
        dailyMap.set(date, item);
      }
    });

    return Array.from(dailyMap.values()).slice(0, 5);
  };

  return (
    <div className="app">
      <h1>Weather Forecast App</h1>
      <div className="search">
        <input
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button onClick={fetchWeather}>Search</button>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : weatherData ? (
        <div className="forecast">
          <h2>{weatherData.city.name}, {weatherData.city.country}</h2>
          <div className="card-container">
            {getFiveDayForecast(weatherData.list).map((item, index) => (
              <div key={index} className="card">
                <p>
                  {new Date(item.dt_txt).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt={item.weather[0].description}
                />
                <p>{item.main.temp}°C</p>
                <p>{item.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
