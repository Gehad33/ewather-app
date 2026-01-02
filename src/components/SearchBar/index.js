import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const popularCities = [
    'القاهرة', 'الرياض', 'دبي', 'الدار البيضاء', 'تونس',
    'عمّان', 'بيروت', 'الخرطوم', 'طرابلس', 'مسقط',
    'المنامة', 'الدوحة', 'الكويت', 'الجزائر', 'الرباط'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 1) {
      const filtered = popularCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (city) => {
    setQuery(city);
    onSearch(city);
    setSuggestions([]);
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="ابحث عن مدينة..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            🔍
          </button>
        </div>
        
        {suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((city, index) => (
              <button
                key={index}
                type="button"
                className="suggestion-item"
                onClick={() => handleSuggestionClick(city)}
              >
                📍 {city}
              </button>
            ))}
          </div>
        )}
      </form>
      
      <div className="popular-cities">
        <p className="popular-label">مدن شائعة:</p>
        <div className="popular-tags">
          {popularCities.slice(0, 6).map((city, index) => (
            <button
              key={index}
              type="button"
              className="popular-tag"
              onClick={() => {
                onSearch(city);
                setQuery('');
              }}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;