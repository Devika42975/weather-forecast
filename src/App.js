import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('Hyderabad');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

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

  const fetchWeatherByLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
        .then(res => res.json())
        .then(data => {
          if (data.cod === "200") {
            setWeatherData(data);
            setCity(data.city.name);
            setError('');
          } else {
            setError("Failed to get location weather");
            setWeatherData(null);
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Error fetching location weather");
          setWeatherData(null);
          setLoading(false);
        });
    });
  };

  const getFiveDayForecast = (list) => {
    const dailyMap = new Map();
    list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      const time = item.dt_txt.split(' ')[1];
      if (time === "12:00:00" && !dailyMap.has(date)) {
        dailyMap.set(date, item);
      }
    });
    return Array.from(dailyMap.values()).slice(0, 5);
  };

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const toggleTheme = () => {
    setDarkMode(prev => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <div className="top-bar">
        <h1>Weather Forecast</h1>
        <div className="theme-toggle">
          <button onClick={toggleTheme}>
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>

      <div className="search">
        <input
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button onClick={fetchWeather}>Get Weather</button>
        <button onClick={fetchWeatherByLocation}>📍 Use My Location</button>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : weatherData ? (
        <div className="forecast">
          <h2>{weatherData.city.name}, {weatherData.city.country}</h2>
          <div className="card-container">
            {getFiveDayForecast(weatherData.list).map((item, index) => (
              <div key={index} className="card">
                <p>{new Date(item.dt_txt).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}</p>
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
