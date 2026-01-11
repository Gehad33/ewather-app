import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, recentSearches = [] }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const popularCities = [
    'القاهرة', 'الرياض', 'دبي', 'الدار البيضاء', 'تونس',
    'عمّان', 'بيروت', 'الخرطوم', 'طرابلس', 'مسقط',
    'المنامة', 'الدوحة', 'الكويت', 'الجزائر', 'الرباط',
    'جدة', 'مكة', 'المدينة', 'الإسكندرية', 'المنصورة',
    'الغردقة', 'شرم الشيخ', 'بنغازي', 'مراكش', 'فاس'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsLoading(true);
      await onSearch(query.trim());
      setIsLoading(false);
      setQuery('');
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    
    if (value.length > 0) {
      const allSuggestions = [
        ...recentSearches.filter(city => 
          city.toLowerCase().includes(value.toLowerCase())
        ),
        ...popularCities.filter(city => 
          city.toLowerCase().includes(value.toLowerCase()) && 
          !recentSearches.includes(city)
        )
      ];
      
      // إزالة التكرارات
      const uniqueSuggestions = [...new Set(allSuggestions)];
      setSuggestions(uniqueSuggestions.slice(0, 8));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = async (city) => {
    setIsLoading(true);
    setQuery(city);
    await onSearch(city);
    setIsLoading(false);
    setShowSuggestions(false);
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'ar-SA';
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsLoading(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        onSearch(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsLoading(false);
      };
      
      recognition.onend = () => {
        setIsLoading(false);
      };
      
      recognition.start();
    } else {
      alert('متصفحك لا يدعم البحث الصوتي');
    }
  };

  const handleImageSearch = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setIsLoading(true);
        // هنا يمكنك إضافة منطق لتحليل الصورة واستخراج اسم المدينة
        // للتبسيط، سنستخدم نموذج محاكاة
        setTimeout(() => {
          const mockCities = ['القاهرة', 'الرياض', 'دبي', 'الدار البيضاء'];
          const randomCity = mockCities[Math.floor(Math.random() * mockCities.length)];
          setQuery(randomCity);
          onSearch(randomCity);
          setIsLoading(false);
        }, 2000);
      }
    };
    
    input.click();
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            placeholder="اكتب اسم المدينة أو استخدم المايكروفون..."
            className="search-input"
            dir="rtl"
          />
          
          <div className="search-buttons">
            <button 
              type="button" 
              className="voice-search-button"
              onClick={handleVoiceSearch}
              title="بحث صوتي"
            >
              🎤
            </button>
            
            <button 
              type="button" 
              className="image-search-button"
              onClick={handleImageSearch}
              title="بحث بالصورة"
            >
              📷
            </button>
            
            <button 
              type="submit" 
              className="search-button"
              disabled={isLoading}
            >
              {isLoading ? '⌛' : '🔍'}
            </button>
          </div>
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            <div className="suggestions-header">
              <span>اقتراحات البحث</span>
            </div>
            {suggestions.map((city, index) => (
              <button
                key={index}
                type="button"
                className="suggestion-item"
                onClick={() => handleSuggestionClick(city)}
              >
                <span className="suggestion-icon">📍</span>
                <span className="suggestion-text">{city}</span>
                <span className="suggestion-type">
                  {recentSearches.includes(city) ? 'سابقاً' : 'شائع'}
                </span>
              </button>
            ))}
          </div>
        )}
      </form>
      
      <div className="search-tips">
        <p className="tips-title">💡 تلميحات البحث:</p>
        <ul className="tips-list">
          <li>يمكنك كتابة اسم المدينة بالعربية أو الإنجليزية</li>
          <li>استخدم النقاط للفصل بين المدينة والدولة: "القاهرة, مصر"</li>
          <li>ابحث عن رمز البريدي أو الإحداثيات</li>
          <li>استخدم المايكروفون للبحث الصوتي</li>
        </ul>
      </div>
      
      <div className="popular-cities">
        <p className="popular-label">🏙️ مدن شائعة:</p>
        <div className="popular-tags">
          {popularCities.slice(0, 8).map((city, index) => (
            <button
              key={index}
              type="button"
              className="popular-tag"
              onClick={() => {
                setQuery(city);
                onSearch(city);
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
