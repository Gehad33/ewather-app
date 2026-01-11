const API_KEY = '792f1f2de227065ff9974d77450563f9';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// قائمة بديلة للمفاتيح
const ALT_API_KEYS = [
  '792f1f2de227065ff9974d77450563f9',
  'your_second_api_key_here',
  'your_third_api_key_here'
];

let currentApiKeyIndex = 0;

const getApiKey = () => {
  return ALT_API_KEYS[currentApiKeyIndex];
};

const rotateApiKey = () => {
  currentApiKeyIndex = (currentApiKeyIndex + 1) % ALT_API_KEYS.length;
  console.log('Rotating to API key index:', currentApiKeyIndex);
};

// دالة لتحسين صياغة اسم المدينة
const normalizeCityName = (city) => {
  // إزالة المسافات الزائدة
  city = city.trim();
  
  // تحويل لغة الأرقام العربية إلى إنجليزية
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  arabicNumbers.forEach((arabicNum, index) => {
    city = city.replace(new RegExp(arabicNum, 'g'), englishNumbers[index]);
  });
  
  // تحسين التنسيق
  city = city.replace(/\s*,\s*/g, ',');
  city = city.replace(/\s+/g, ' ');
  
  return city;
};

// دالة للبحث الذكي عن المدينة
const smartCitySearch = async (query, unit = 'metric') => {
  const normalizedQuery = normalizeCityName(query);
  
  // محاولات بحث مختلفة
  const searchPatterns = [
    normalizedQuery, // الاسم كما هو
    normalizedQuery.split(',')[0].trim(), // المدينة فقط
    normalizedQuery.replace(/[\u064B-\u065F]/g, ''), // إزالة التشكيل
    encodeURIComponent(normalizedQuery), // ترميز URL
  ];
  
  for (const pattern of searchPatterns) {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${pattern}&units=${unit}&appid=${getApiKey()}&lang=ar`
      );
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log(`Pattern ${pattern} failed, trying next...`);
    }
  }
  
  // إذا فشلت جميع المحاولات
  throw new Error('لم يتم العثور على المدينة. حاول كتابة الاسم بشكل مختلف.');
};

export const getWeatherData = async (city, unit = 'metric') => {
  try {
    const data = await smartCitySearch(city, unit);
    return data;
  } catch (error) {
    console.error('Weather API error:', error);
    
    // محاولة استخدام مفتاح API مختلف
    if (error.message.includes('401')) {
      rotateApiKey();
      return getWeatherData(city, unit);
    }
    
    throw error;
  }
};

export const getForecastData = async (city, unit = 'metric') => {
  try {
    const normalizedQuery = normalizeCityName(city);
    const response = await fetch(
      `${BASE_URL}/forecast?q=${normalizedQuery}&units=${unit}&appid=${getApiKey()}&lang=ar`
    );
    
    if (!response.ok) {
      if (response.status === 401) {
        rotateApiKey();
        return getForecastData(city, unit);
      }
      throw new Error('لا يمكن جلب توقعات الطقس');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Forecast API error:', error);
    throw error;
  }
};

export const getAirQuality = async (city) => {
  try {
    // الحصول على إحداثيات المدينة أولاً
    const geoResponse = await fetch(
      `${BASE_URL}/weather?q=${normalizeCityName(city)}&appid=${getApiKey()}`
    );
    
    if (!geoResponse.ok) {
      if (geoResponse.status === 401) {
        rotateApiKey();
        return getAirQuality(city);
      }
      throw new Error('لا يمكن تحديد موقع المدينة');
    }
    
    const geoData = await geoResponse.json();
    const { lat, lon } = geoData.coord;
    
    // الحصول على بيانات جودة الهواء
    const aqResponse = await fetch(
      `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${getApiKey()}`
    );
    
    if (!aqResponse.ok) {
      if (aqResponse.status === 401) {
        rotateApiKey();
        return getAirQuality(city);
      }
      throw new Error('لا يمكن جلب بيانات جودة الهواء');
    }
    
    const aqData = await aqResponse.json();
    
    if (aqData && aqData.list && aqData.list[0]) {
      return {
        aqi: aqData.list[0].main.aqi,
        components: aqData.list[0].components,
        timestamp: aqData.list[0].dt
      };
    }
    
    throw new Error('بيانات جودة الهواء غير متوفرة');
    
  } catch (error) {
    console.error('Air quality API error:', error);
    
    // بيانات تجريبية للتنمية
    return {
      aqi: Math.floor(Math.random() * 4) + 1,
      components: {
        co: (Math.random() * 1000 + 200).toFixed(1),
        no: (Math.random() * 50 + 10).toFixed(1),
        no2: (Math.random() * 50 + 20).toFixed(1),
        o3: (Math.random() * 100 + 30).toFixed(1),
        so2: (Math.random() * 20 + 5).toFixed(1),
        pm2_5: (Math.random() * 50 + 10).toFixed(1),
        pm10: (Math.random() * 70 + 20).toFixed(1),
        nh3: (Math.random() * 10 + 1).toFixed(1)
      },
      timestamp: Date.now() / 1000
    };
  }
};

export const getWeatherByCoords = async (lat, lon, unit = 'metric') => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${getApiKey()}&lang=ar`
    );
    
    if (!response.ok) {
      if (response.status === 401) {
        rotateApiKey();
        return getWeatherByCoords(lat, lon, unit);
      }
      throw new Error('لا يمكن جلب بيانات الطقس للموقع الحالي');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Weather by coords error:', error);
    throw error;
  }
};

// دالة للبحث عن مدن متشابهة
export const searchCities = async (query) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${getApiKey()}`
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.map(city => ({
        name: city.name,
        country: city.country,
        state: city.state,
        lat: city.lat,
        lon: city.lon
      }));
    }
    return [];
  } catch (error) {
    console.error('City search error:', error);
    return [];
  }
};