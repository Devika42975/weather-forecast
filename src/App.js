import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('Hyderabad');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = "d7aa93a06672a9120716d142a5026396";

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        if (data.cod !== "200") {
          setError(data.message);
          setWeatherData(null);
        } else {
          setError(null);
          setWeatherData(data);
        }
      } catch (err) {
        setError("Failed to fetch weather data.");
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const getFiveDayForecast = (list) => {
    const dailyData = [];
    const seenDates = new Set();

    for (let i = 0; i < list.length; i++) {
      const forecast = list[i];
      const [date, time] = forecast.dt_txt.split(" ");

      if (time === "12:00:00" && !seenDates.has(date)) {
        seenDates.add(date);
        dailyData.push(forecast);
      }

      if (dailyData.length === 5) break;
    }

    return dailyData;
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  return (
    <div className="app">
      <h1>Weather Forecast App</h1>
      <input
        value={city}
        onChange={e => setCity(e.target.value)}
        placeholder="Enter city"
      />

      {error && <p className="error">{error}</p>}
      {loading && <div className="spinner"></div>}

      {weatherData && !loading ? (
        <div className="forecast">
          <h2>{weatherData.city.name}</h2>
          {getFiveDayForecast(weatherData.list).map((item, index) => (
            <div key={index} className="card">
              <p>{getDayName(item.dt_txt)}</p>
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt={item.weather[0].description}
              />
              <p>{item.main.temp}°C</p>
              <p>{item.weather[0].description}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default App;
