import React from 'react';
import './WeatherCard.css';

const WeatherCard = ({ data, unit }) => {
  if (!data) return null;

  const getTemperature = (temp) => {
    return Math.round(temp);
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getArabicDescription = (description) => {
    const descriptions = {
      'clear sky': 'سماء صافية',
      'few clouds': 'قليل من السحب',
      'scattered clouds': 'سحب متفرقة',
      'broken clouds': 'غيوم كثيفة',
      'shower rain': 'مطر خفيف',
      'rain': 'مطر',
      'thunderstorm': 'عاصفة رعدية',
      'snow': 'ثلج',
      'mist': 'ضباب',
      'overcast clouds': 'غيوم كثيفة'
    };
    return descriptions[description] || description;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('ar-EG', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <div className="location">
          <h2>
            <span className="location-icon">📍</span>
            {data.name}, {data.sys.country}
          </h2>
          <p className="description">
            {getArabicDescription(data.weather[0].description)}
          </p>
        </div>
        <div className="time">
          <p>{new Date().toLocaleDateString('ar-EG', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
        </div>
      </div>

      <div className="weather-card-body">
        <div className="temperature-section">
          <div className="current-temp">
            <span className="temp-value">{getTemperature(data.main.temp)}</span>
            <span className="temp-unit">°{unit === 'metric' ? 'م' : 'ف'}</span>
          </div>
          <div className="temp-feels">
            <p>🌡️ الشعور: {getTemperature(data.main.feels_like)}°</p>
          </div>
          <div className="temp-range">
            <p>🔥 العظمى: {getTemperature(data.main.temp_max)}°</p>
            <p>❄️ الصغرى: {getTemperature(data.main.temp_min)}°</p>
          </div>
        </div>

        <div className="weather-icon-section">
          <img 
            src={getWeatherIcon(data.weather[0].icon)} 
            alt={data.weather[0].description}
            className="weather-icon"
          />
        </div>

        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-icon">💧</span>
            <div className="detail-info">
              <span className="detail-label">الرطوبة</span>
              <span className="detail-value">{data.main.humidity}%</span>
            </div>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon">💨</span>
            <div className="detail-info">
              <span className="detail-label">الرياح</span>
              <span className="detail-value">{data.wind.speed} {unit === 'metric' ? 'م/ث' : 'ميل/س'}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon">⚖️</span>
            <div className="detail-info">
              <span className="detail-label">الضغط</span>
              <span className="detail-value">{data.main.pressure} هبا</span>
            </div>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon">👁️</span>
            <div className="detail-info">
              <span className="detail-label">الرؤية</span>
              <span className="detail-value">{data.visibility / 1000} كم</span>
            </div>
          </div>
        </div>
      </div>

      <div className="weather-card-footer">
        <div className="sun-times">
          <div className="sun-time sunrise">
            <span className="sun-icon">🌅</span>
            <div>
              <span className="sun-label">الشروق</span>
              <span className="sun-value">{formatTime(data.sys.sunrise)}</span>
            </div>
          </div>
          <div className="sun-time sunset">
            <span className="sun-icon">🌇</span>
            <div>
              <span className="sun-label">الغروب</span>
              <span className="sun-value">{formatTime(data.sys.sunset)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;