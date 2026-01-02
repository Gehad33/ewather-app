import React from 'react';
import './AirQuality.css';

const AirQuality = ({ data }) => {
  if (!data) {
    return (
      <div className="air-quality-card">
        <div className="aqi-header">
          <h3>🌬️ جودة الهواء</h3>
          <span className="aqi-value">--</span>
        </div>
        <p className="aqi-message">بيانات جودة الهواء غير متوفرة حالياً</p>
      </div>
    );
  }

  const getAQILevel = (aqi) => {
    switch (aqi) {
      case 1:
        return { level: 'ممتاز', color: '#10b981', emoji: '😊' };
      case 2:
        return { level: 'جيد', color: '#3b82f6', emoji: '🙂' };
      case 3:
        return { level: 'متوسط', color: '#f59e0b', emoji: '😐' };
      case 4:
        return { level: 'سيء', color: '#ef4444', emoji: '😷' };
      case 5:
        return { level: 'خطير', color: '#7c3aed', emoji: '⚠️' };
      default:
        return { level: 'غير معروف', color: '#64748b', emoji: '❓' };
    }
  };

  const aqiInfo = getAQILevel(data.aqi);

  const pollutants = [
    { name: 'الجسيمات الدقيقة', value: data.components?.pm2_5 || '--', unit: 'μg/m³', color: '#ef4444' },
    { name: 'ثاني أكسيد النيتروجين', value: data.components?.no2 || '--', unit: 'μg/m³', color: '#f59e0b' },
    { name: 'الأوزون', value: data.components?.o3 || '--', unit: 'μg/m³', color: '#3b82f6' },
    { name: 'أول أكسيد الكربون', value: data.components?.co || '--', unit: 'μg/m³', color: '#64748b' },
  ];

  return (
    <div className="air-quality-card">
      <div className="aqi-header">
        <h3>🌬️ جودة الهواء</h3>
        <span className="aqi-badge" style={{ background: aqiInfo.color }}>
          {aqiInfo.emoji} {aqiInfo.level}
        </span>
      </div>

      <div className="aqi-meter">
        <div className="meter-labels">
          <span>ممتاز</span>
          <span>جيد</span>
          <span>متوسط</span>
          <span>سيء</span>
          <span>خطير</span>
        </div>
        <div className="meter-bar">
          <div 
            className="meter-fill" 
            style={{ 
              width: `${(data.aqi / 5) * 100}%`,
              background: aqiInfo.color 
            }}
          />
        </div>
      </div>

      <div className="pollutants-grid">
        {pollutants.map((pollutant, index) => (
          <div key={index} className="pollutant-item">
            <div className="pollutant-header">
              <span className="pollutant-name">{pollutant.name}</span>
              <span 
                className="pollutant-dot"
                style={{ background: pollutant.color }}
              />
            </div>
            <span className="pollutant-value">
              {pollutant.value} <small>{pollutant.unit}</small>
            </span>
          </div>
        ))}
      </div>

      <div className="aqi-tips">
        <h4>💡 نصائح:</h4>
        <div className="tips-content">
          {data.aqi <= 2 ? (
            <>
              <p>✅ الهواء نقي، استمتع بالأنشطة الخارجية</p>
              <p>✅ افتح النوافذ للتهوية</p>
            </>
          ) : data.aqi === 3 ? (
            <>
              <p>⚠️ تجنب الأنشطة الخارجية المطولة</p>
              <p>⚠️ استخدم المرشحات الهوائية إن وجدت</p>
            </>
          ) : (
            <>
              <p>🚫 تجنب الخروج قدر الإمكان</p>
              <p>🚫 استخدم كمامات مناسبة</p>
              <p>🚫 أغلق النوافذ</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AirQuality;