import React from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="weather-loader">
          <div className="cloud"></div>
          <div className="sun"></div>
          <div className="rain">
            <div className="drop"></div>
            <div className="drop"></div>
            <div className="drop"></div>
          </div>
        </div>
        <p className="loading-text">جاري تحميل بيانات الطقس...</p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default Loading;