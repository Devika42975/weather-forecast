import React, { useState, useEffect } from 'react';
import './App.css';

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

function App() {
  const [city, setCity] = useState('Hyderabad');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = "d7aa93a06672a9120716d142a5026396";

  useEffect(() => {
    if (!city) return;
    setLoading(true);
    setError('');
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
      .then(response => response.json())
      .then(data => {
        if (data.cod === "200") {
          setWeatherData(data);
        } else {
          setError("City not found");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, [city]);

  return (
    <div className="app">
      <h1>Weather Forecast App</h1>
      <input value={city} onChange={e => setCity(e.target.value)} placeholder="Enter city" />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weatherData && !loading && !error && (
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
      )}
    </div>
  );
}

export default App;
