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

// Get city by geolocation
router.get('/cities/geo/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    
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
      return res.status(404).json({
        success: false,
        message: 'No city found at these coordinates'
      });
    }
  } catch (error) {
    console.error('Error fetching city by geolocation from AccuWeather:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching city by geolocation',
      error: error.message
    });
  }
});

// Get current weather conditions
router.get('/current/:locationKey', async (req, res) => {
  try {
    const { locationKey } = req.params;
    
    const response = await axios.get(
      `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${ACCUWEATHER_API_KEY}&details=true`
    );
    
    if (response.data && response.data.length > 0) {
      return res.json({
        success: true,
        data: response.data[0]
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'No weather data available for this location'
      });
    }
  } catch (error) {
    console.error('Error fetching current weather from AccuWeather:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching current weather',
      error: error.message
    });
  }
});

module.exports = router;
