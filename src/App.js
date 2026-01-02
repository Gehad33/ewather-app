import React, { useState, useEffect } from 'react';
import './styles/App.css';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import Loading from './components/Loading';
import AirQuality from './components/AirQuality';
import { getWeatherData, getForecastData, getAirQuality } from './services/weatherService';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('القاهرة');
  const [unit, setUnit] = useState('metric');
  const [theme, setTheme] = useState('default');
  const [recentCities, setRecentCities] = useState([]);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch current weather
      const weather = await getWeatherData(cityName, unit);
      setWeatherData(weather);
      setCity(cityName);
      
      // Update theme based on weather
      updateTheme(weather.weather[0].main);
      
      // Fetch forecast
      const forecast = await getForecastData(cityName, unit);
      setForecastData(forecast);
      
      // Fetch air quality (optional)
      try {
        const airQuality = await getAirQuality(cityName);
        setAirQualityData(airQuality);
      } catch (aqError) {
        console.log('Air quality data not available');
      }
      
      // Add to recent cities
      addToRecentCities(cityName);
      
    } catch (err) {
      setError(err.message || 'حدث خطأ في جلب البيانات');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = (weatherCondition) => {
    const themes = {
      'Clear': 'sunny',
      'Clouds': 'cloudy',
      'Rain': 'rainy',
      'Thunderstorm': 'stormy',
      'Snow': 'default'
    };
    setTheme(themes[weatherCondition] || 'default');
  };

  const addToRecentCities = (cityName) => {
    const updated = [cityName, ...recentCities.filter(c => c !== cityName).slice(0, 4)];
    setRecentCities(updated);
    localStorage.setItem('recentCities', JSON.stringify(updated));
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  useEffect(() => {
    fetchWeather('القاهرة');
    const savedCities = localStorage.getItem('recentCities');
    if (savedCities) {
      setRecentCities(JSON.parse(savedCities));
    }
  }, []);

  useEffect(() => {
    if (city) {
      fetchWeather(city);
    }
  }, [unit]);

  return (
    <div className={`App ${theme}`}>
      <div className="container">
        <header className="header">
          <h1>🌤️ تطبيق الطقس الذكي</h1>
          <p>توقعات طقس دقيقة لأي مدينة حول العالم</p>
        </header>

        <div className="controls">
          <SearchBar onSearch={fetchWeather} />
          <button className="unit-toggle" onClick={toggleUnit}>
            {unit === 'metric' ? '°C ← °F' : '°F ← °C'}
          </button>
        </div>

        {recentCities.length > 0 && (
          <div className="recent-searches">
            <h3>🔍 مدن سابقة:</h3>
            <div className="recent-tags">
              {recentCities.map((cityName, index) => (
                <button
                  key={index}
                  className="recent-tag"
                  onClick={() => fetchWeather(cityName)}
                >
                  {cityName}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <Loading />}

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => fetchWeather('القاهرة')}>
              ↻ المحاولة مرة أخرى
            </button>
          </div>
        )}

        {weatherData && (
          <>
            <div className="main-content">
              <WeatherCard 
                data={weatherData} 
                unit={unit}
              />
              
              <div className="sidebar">
                <AirQuality data={airQualityData} />
              </div>
            </div>

            {forecastData && (
              <Forecast data={forecastData} unit={unit} />
            )}
          </>
        )}

        <footer className="footer">
          <p>© {new Date().getFullYear()} تطبيق الطقس - بيانات من OpenWeatherMap</p>
          <p>💡 جرب: الرياض، دبي، لندن، نيويورك</p>
        </footer>
      </div>
    </div>
  );
}

export default App;