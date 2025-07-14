async function getWeather() {
    const city = document.getElementById("cityInput").value;
    const apiKey = "d7aa93a06672a9120716d142a5026396"; // Your API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    const resultDiv = document.getElementById("weatherResult");
    resultDiv.innerHTML = "";

    if (data.cod === "200") {
        const dailyForecast = [];
        const addedDates = new Set();

        data.list.forEach(item => {
            const date = new Date(item.dt_txt);
            const day = date.toDateString();
            const hour = date.getHours();

            // Pick forecasts close to 12:00 PM and only once per day
            if (hour === 12 && !addedDates.has(day)) {
                addedDates.add(day);
                dailyForecast.push(item);
            }
        });

        // Show only 5 days
        dailyForecast.slice(0, 5).forEach(item => {
            const weatherItem = document.createElement("div");
            weatherItem.innerHTML = `
                <h3>${new Date(item.dt_txt).toDateString()}</h3>
                <p>Temp: ${item.main.temp}°C</p>
                <p>${item.weather[0].description}</p>
            `;
            resultDiv.appendChild(weatherItem);
        });

    } else {
        resultDiv.innerHTML = "<p>City not found.</p>";
    }
                    }
