import { useState } from "react";
import "./App.css";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {
    try {
      setError("");
      setLoading(true);
      setWeather(null);

      // 1️⃣ Get coordinates
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("❌ City not found!");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country, timezone } =
        geoData.results[0];

      // 2️⃣ Get weather data
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=sunrise,sunset&timezone=${timezone}`
      );
      const weatherData = await weatherRes.json();

      if (!weatherData.current_weather || !weatherData.daily) {
        setError("⚠️ Couldn't fetch weather data.");
        setLoading(false);
        return;
      }

      const current = weatherData.current_weather;
      const daily = weatherData.daily;
      const sunrise = daily.sunrise[0]?.split("T")[1] || "N/A";
      const sunset = daily.sunset[0]?.split("T")[1] || "N/A";

      // 3️⃣ Create background image from Unsplash
      const keyword = getWeatherKeyword(current.weathercode);
      const imageUrl = `https://source.unsplash.com/1600x900/?${keyword},${name}`;

      setWeather({
        name,
        country,
        temperature: current.temperature,
        windspeed: current.windspeed,
        code: current.weathercode,
        imageUrl,
        timezone,
        sunrise,
        sunset,
      });

      setLoading(false);
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError("⚠️ Error fetching data. Try again.");
      setLoading(false);
    }
  };

  const getWeatherKeyword = (code) => {
    if ([0, 1].includes(code)) return "sunrise,sunny,sky";
    if ([2, 3].includes(code)) return "cloudy,overcast";
    if ([45, 48].includes(code)) return "fog,mist";
    if ([51, 61, 63, 65].includes(code)) return "rain,rainy";
    if ([71, 73, 75].includes(code)) return "snow,winter";
    if ([95, 96, 99].includes(code)) return "thunderstorm,lightning";
    return "weather,sky";
  };

  const getLocalTime = (tz) => {
    try {
      return new Date().toLocaleTimeString("en-US", {
        timeZone: tz,
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return new Date().toLocaleTimeString();
    }
  };

  return (
    <div
      className={`App ${weather ? "fade-in" : ""}`}
      style={{
        backgroundImage: weather
          ? `url(${weather.imageUrl})`
          : "url('https://source.unsplash.com/1600x900/?sky,weather')",
      }}
    >
      <div className="overlay">
        <h1 className="app-name">🌍 Live Weather Dashboard</h1>

        {/* ✅ Search Bar */}
        <div className="search-bar">
          <input
            className="city-search"
            placeholder="🔍 Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getWeather()}
          />
          <button className="search-btn" onClick={getWeather}>
            Search
          </button>
        </div>

        {loading && (
          <div className="Loader">
            <div></div>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        {weather && (
          <div className="weather-card">
            <h2 className="city-name">
              {weather.name}, {weather.country}
            </h2>
            <p className="date">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="time">
              🕒 Local Time: {getLocalTime(weather.timezone)}
            </p>

            <div className="weather-icon">
              <img
                src={`https://source.unsplash.com/200x200/?${getWeatherKeyword(
                  weather.code
                )}`}
                alt="weather"
              />
            </div>

            <div className="icon-temp">
              {weather.temperature}
              <span className="deg">°C</span>
            </div>
            <p className="des-wind">💨 Wind: {weather.windspeed} km/h</p>
            <p className="sunrise">🌅 Sunrise: {weather.sunrise}</p>
            <p className="sunset">🌇 Sunset: {weather.sunset}</p>
          </div>
        )}
      </div>
    </div>
  );
}
