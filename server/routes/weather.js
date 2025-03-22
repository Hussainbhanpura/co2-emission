const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// AccuWeather API key
const ACCUWEATHER_API_KEY = 'UHfGEBcogQcmOY2DGWgLlDwBPA2g02RQ';

// Search for cities
router.get('/cities/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const response = await axios.get(
      `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${ACCUWEATHER_API_KEY}&q=${encodeURIComponent(query)}`
    );
    
    // Transform the data to match our application's format
    const cities = response.data.map((city, index) => ({
      id: city.Key,
      name: city.LocalizedName,
      country: city.Country.LocalizedName,
      administrativeArea: city.AdministrativeArea.LocalizedName,
      rank: index + 1
    }));
    
    return res.json({
      success: true,
      data: cities
    });
  } catch (error) {
    console.error('Error fetching cities from AccuWeather:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching cities',
      error: error.message
    });
  }
});

// Mock data for fallback when API is unavailable
const mockWeatherData = {
  temperature: {
    Value: 28,
    Unit: 'C',
    UnitType: 17
  },
  humidity: 65,
  windSpeed: {
    Value: 8,
    Unit: 'km/h',
    UnitType: 7
  },
  windDirection: {
    Degrees: 45,
    Localized: 'NE'
  },
  weatherText: 'Partly cloudy',
  weatherIcon: 3,
  hasPrecipitation: false,
  isDayTime: true
};

// Mock cities for fallback
const mockCitiesByGeo = {
  '17.54,78.57': { // Hyderabad approximate
    Key: '202190',
    LocalizedName: 'Hyderabad',
    Country: { LocalizedName: 'India' },
    AdministrativeArea: { LocalizedName: 'Telangana' }
  },
  '19.07,72.87': { // Mumbai approximate
    Key: '204842',
    LocalizedName: 'Mumbai',
    Country: { LocalizedName: 'India' },
    AdministrativeArea: { LocalizedName: 'Maharashtra' }
  },
  '28.61,77.20': { // Delhi approximate
    Key: '202396',
    LocalizedName: 'New Delhi',
    Country: { LocalizedName: 'India' },
    AdministrativeArea: { LocalizedName: 'Delhi' }
  }
};

// Get city by geolocation
router.get('/cities/geo/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    
    // Try to get data from AccuWeather API
    try {
      const response = await axios.get(
        `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${ACCUWEATHER_API_KEY}&q=${lat},${lng}`
      );
      
      if (response.data) {
        const city = {
          id: response.data.Key,
          name: response.data.LocalizedName,
          country: response.data.Country.LocalizedName,
          administrativeArea: response.data.AdministrativeArea.LocalizedName,
          type: response.data.Type,
          rank: 1
        };
        
        return res.json({
          success: true,
          data: city
        });
      } else {
        throw new Error('No city found at these coordinates');
      }
    } catch (apiError) {
      console.error('Error fetching city by geolocation from AccuWeather:', apiError);
      
      // Find closest mock city based on coordinates
      const roundedLat = Math.round(parseFloat(lat) * 100) / 100;
      const roundedLng = Math.round(parseFloat(lng) * 100) / 100;
      
      // Find the closest mock city
      let closestCity = null;
      let minDistance = Infinity;
      
      for (const [mockGeo, cityData] of Object.entries(mockCitiesByGeo)) {
        const [mockLat, mockLng] = mockGeo.split(',').map(parseFloat);
        const distance = Math.sqrt(
          Math.pow(mockLat - parseFloat(lat), 2) + 
          Math.pow(mockLng - parseFloat(lng), 2)
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          closestCity = cityData;
        }
      }
      
      if (closestCity) {
        const city = {
          id: closestCity.Key,
          name: closestCity.LocalizedName,
          country: closestCity.Country.LocalizedName,
          administrativeArea: closestCity.AdministrativeArea.LocalizedName,
          type: 'City',
          rank: 1
        };
        
        console.log(`Using fallback data for ${city.name} due to API limitations`);
        
        return res.json({
          success: true,
          data: city,
          message: 'Using fallback data due to API limitations'
        });
      }
    }
    
    // If we get here, both API and fallback failed
    return res.status(404).json({
      success: false,
      message: 'No city found at these coordinates'
    });
  } catch (error) {
    console.error('Error in geo location route:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing request',
      error: error.message
    });
  }
});

// Get current weather conditions
router.get('/current/:locationKey', async (req, res) => {
  try {
    const { locationKey } = req.params;
    
    try {
      const response = await axios.get(
        `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${ACCUWEATHER_API_KEY}&details=true`
      );
      
      if (response.data && response.data.length > 0) {
        return res.json({
          success: true,
          data: response.data[0]
        });
      } else {
        throw new Error('No weather data available for this location');
      }
    } catch (apiError) {
      console.error('Error fetching current weather from AccuWeather:', apiError);
      
      // Use mock weather data as fallback
      // Customize the mock data based on location if needed
      const weatherData = { ...mockWeatherData };
      
      // Add timestamp for realism
      weatherData.EpochTime = Math.floor(Date.now() / 1000);
      weatherData.LocalObservationDateTime = new Date().toISOString();
      
      console.log(`Using fallback weather data for location ${locationKey} due to API limitations`);
      
      return res.json({
        success: true,
        data: weatherData,
        message: 'Using fallback data due to API limitations'
      });
    }
  } catch (error) {
    console.error('Error in current weather route:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing weather request',
      error: error.message
    });
  }
});

module.exports = router;
