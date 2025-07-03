import React, { useState } from 'react';
import './App.css';

const API_KEY = 'd7aa93a06672a9120716d142a5026396'; // ⬅️ Replace this with your OpenWeatherMap API key

function App() {
  const [location, setLocation] = useState('');
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  const fetchWeather = async (cityName) => {
    try {
      setError('');
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod !== "200") {
        setError('City not found.');
        setForecast([]);
        return;
      }

      const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));
      setForecast(daily.slice(0, 5));
      setCity(data.city.name);
    } catch (error) {
      setError('Something went wrong.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(location);
  };

  return (
    <div className="app">
      <h1>🌤️ Weather Forecast App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">Get Forecast</button>
      </form>

      {error && <p className="error">{error}</p>}

      {forecast.length > 0 && (
        <div className="forecast-container">
          <h2>5-Day Forecast for {city}</h2>
          <div className="forecast">
            {forecast.map((day, index) => (
              <div key={index} className="card">
                <p>{new Date(day.dt_txt).toDateString()}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt="weather icon"
                />
                <p>{day.weather[0].description}</p>
                <p>Temp: {day.main.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
