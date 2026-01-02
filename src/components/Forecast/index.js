import React from 'react';
import './Forecast.css';

const Forecast = ({ data, unit }) => {
  if (!data || !data.list) return null;

  // Group forecast by day
  const dailyForecasts = {};
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('ar-EG', { weekday: 'long' });
    
    if (!dailyForecasts[day]) {
      dailyForecasts[day] = {
        temp_max: item.main.temp_max,
        temp_min: item.main.temp_min,
        icon: item.weather[0].icon,
        description: item.weather[0].description,
        date: date.toLocaleDateString('ar-EG')
      };
    } else {
      dailyForecasts[day].temp_max = Math.max(dailyForecasts[day].temp_max, item.main.temp_max);
      dailyForecasts[day].temp_min = Math.min(dailyForecasts[day].temp_min, item.main.temp_min);
    }
  });

  const getArabicDay = (day) => {
    const days = {
      'Sunday': 'الأحد',
      'Monday': 'الإثنين',
      'Tuesday': 'الثلاثاء',
      'Wednesday': 'الأربعاء',
      'Thursday': 'الخميس',
      'Friday': 'الجمعة',
      'Saturday': 'السبت'
    };
    return days[day] || day;
  };

  const getTemperature = (temp) => Math.round(temp);

  return (
    <div className="forecast-container">
      <h3 className="forecast-title">📅 توقعات 5 أيام</h3>
      
      <div className="forecast-days">
        {Object.entries(dailyForecasts).slice(0, 5).map(([day, forecast], index) => (
          <div key={index} className="forecast-day">
            <div className="day-header">
              <p className="day-name">{getArabicDay(day)}</p>
              <p className="day-date">{forecast.date}</p>
            </div>
            
            <div className="day-icon">
              <img 
                src={`https://openweathermap.org/img/wn/${forecast.icon}.png`}
                alt={forecast.description}
              />
            </div>
            
            <div className="day-temps">
              <span className="temp-max">
                🔥 {getTemperature(forecast.temp_max)}°
              </span>
              <span className="temp-min">
                ❄️ {getTemperature(forecast.temp_min)}°
              </span>
            </div>
            
            <p className="day-desc">{forecast.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;