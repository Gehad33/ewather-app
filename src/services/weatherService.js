const API_KEY = '792f1f2de227065ff9974d77450563f9';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// قائمة بديلة للمفاتيح في حالة عدم عمل المفتاح الأول
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

export const getWeatherData = async (city, unit = 'metric') => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&units=${unit}&appid=${getApiKey()}&lang=ar`
    );
    
    if (!response.ok) {
      if (response.status === 401) {
        rotateApiKey();
        return getWeatherData(city, unit);
      }
      throw new Error('المدينة غير موجودة. جرب اسم آخر.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
};

export const getForecastData = async (city, unit = 'metric') => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&units=${unit}&appid=${getApiKey()}&lang=ar`
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
    // Get coordinates first
    const geoResponse = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${getApiKey()}`
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
    
    // Get air quality data
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
    
    // Return formatted air quality data
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
    // Return mock data for development
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