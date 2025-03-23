const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// Get AQI data by city name
router.get('/city/:city', async (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.aqicn;
  const cityMappings = {
    'Kolkata': ['Calcutta', 'Kolkata - Ballygunge', 'Kolkata - Rabindra Bharati University', 'Kolkata - Victoria'],
    'Mumbai': ['Bombay', 'Mumbai - Bandra', 'Mumbai - Colaba', 'Mumbai - Worli'],
    'Chennai': ['Madras', 'Chennai - Alandur', 'Chennai - Manali'],
    'Bangalore': ['Bengaluru', 'Bangalore - BTM', 'Bangalore - BWSSB'],
    'Delhi': ['New Delhi', 'Delhi - Anand Vihar', 'Delhi - IGI Airport'],
    'Hyderabad': ['Hyderabad - Bollaram', 'Hyderabad - ICRISAT', 'Hyderabad - IDA Pashamylaram', 'Hyderabad - Sanathnagar']
  };
  const localityToMajorCity = {
    'Thumkunta': 'Hyderabad',
    'Kompally': 'Hyderabad',
    'Shamirpet': 'Hyderabad',
    'Medchal': 'Hyderabad',
    'Gachibowli': 'Hyderabad',
    'Madhapur': 'Hyderabad',
    'HITEC City': 'Hyderabad',
    'Secunderabad': 'Hyderabad',
    'Kukatpally': 'Hyderabad',
    'Miyapur': 'Hyderabad',
    'Banjara Hills': 'Hyderabad',
    'Jubilee Hills': 'Hyderabad',
    'Powai': 'Mumbai',
    'Andheri': 'Mumbai',
    'Bandra': 'Mumbai',
    'Dadar': 'Mumbai',
    'Borivali': 'Mumbai',
    'Thane': 'Mumbai',
    'Navi Mumbai': 'Mumbai',
    'Whitefield': 'Bangalore',
    'Electronic City': 'Bangalore',
    'Koramangala': 'Bangalore',
    'Indiranagar': 'Bangalore',
    'HSR Layout': 'Bangalore',
    'Marathahalli': 'Bangalore',
    'JP Nagar': 'Bangalore',
    'Salt Lake': 'Kolkata',
    'Howrah': 'Kolkata',
    'New Town': 'Kolkata',
    'Dum Dum': 'Kolkata',
    'Gurgaon': 'Delhi',
    'Noida': 'Delhi',
    'Faridabad': 'Delhi',
    'Ghaziabad': 'Delhi',
    'Greater Noida': 'Delhi'
  };

  try {
    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        message: 'API key not configured' 
      });
    }

    console.log(`Fetching AQI data for city: ${city}`);
    
    // Try with different variations of the city name
    let response;
    try {
      // First try with the exact city name
      response = await axios.get(`https://api.waqi.info/feed/${encodeURIComponent(city)}/?token=${apiKey}`);
      
      if (response.data.status !== 'ok') {
        // If that fails, try with the city name followed by country
        const cityWithCountry = `${city}, India`;
        console.log(`Trying with city and country: ${cityWithCountry}`);
        response = await axios.get(`https://api.waqi.info/feed/${encodeURIComponent(cityWithCountry)}/?token=${apiKey}`);
      }
    } catch (error) {
      console.error('Error with first attempt, trying alternative city names');
      
      // Check if this is a smaller locality that maps to a major city
      if (localityToMajorCity[city]) {
        const majorCity = localityToMajorCity[city];
        console.log(`${city} is mapped to major city: ${majorCity}`);
        
        // Try with the major city
        try {
          response = await axios.get(`https://api.waqi.info/feed/${encodeURIComponent(majorCity)}/?token=${apiKey}`);
          
          // If major city works, but we want to try specific stations too
          if (response.data.status === 'ok' && cityMappings[majorCity]) {
            // We'll still check specific stations for more accurate data
            for (const altName of cityMappings[majorCity]) {
              try {
                console.log(`Trying station in major city: ${altName}`);
                const stationResponse = await axios.get(`https://api.waqi.info/feed/${encodeURIComponent(altName)}/?token=${apiKey}`);
                if (stationResponse.data.status === 'ok') {
                  // Use this more specific station instead
                  response = stationResponse;
                  break;
                }
              } catch (stationError) {
                console.error(`Failed with station ${altName}:`, stationError.message);
              }
            }
          }
        } catch (majorCityError) {
          console.error(`Failed with major city ${majorCity}:`, majorCityError.message);
        }
      }
      
      // Check if we have alternative names for this city
      if (!response || response.data.status !== 'ok') {
        if (cityMappings[city]) {
          // Try each alternative name
          for (const altName of cityMappings[city]) {
            try {
              console.log(`Trying alternative name: ${altName}`);
              response = await axios.get(`https://api.waqi.info/feed/${encodeURIComponent(altName)}/?token=${apiKey}`);
              if (response.data.status === 'ok') {
                break; // Found a working alternative name
              }
            } catch (altError) {
              console.error(`Failed with alternative name ${altName}:`, altError.message);
            }
          }
        }
      }
      
      // If all alternatives failed, try searching for the city
      if (!response || response.data.status !== 'ok') {
        console.log('Trying search endpoint as last resort');
        const searchResponse = await axios.get(`https://api.waqi.info/search/?token=${apiKey}&keyword=${encodeURIComponent(city)}`);
        
        if (searchResponse.data.status === 'ok' && searchResponse.data.data.length > 0) {
          // Use the first result from the search
          const stationUid = searchResponse.data.data[0].uid;
          response = await axios.get(`https://api.waqi.info/feed/@${stationUid}/?token=${apiKey}`);
        } else {
          // If search also failed, try searching for the major city if it's a locality
          if (localityToMajorCity[city]) {
            const majorCity = localityToMajorCity[city];
            console.log(`Searching for major city: ${majorCity}`);
            const majorCitySearchResponse = await axios.get(`https://api.waqi.info/search/?token=${apiKey}&keyword=${encodeURIComponent(majorCity)}`);
            
            if (majorCitySearchResponse.data.status === 'ok' && majorCitySearchResponse.data.data.length > 0) {
              // Use the first result from the search
              const stationUid = majorCitySearchResponse.data.data[0].uid;
              response = await axios.get(`https://api.waqi.info/feed/@${stationUid}/?token=${apiKey}`);
            }
          }
        }
      }
    }
    
    if (response && response.data.status === 'ok') {
      // Add a note if we're using data from a nearby city
      let responseData = response.data.data;
      
      // Check if this is a smaller locality
      if (localityToMajorCity[city] && responseData.city && responseData.city.name) {
        responseData.note = `Showing air quality data from the nearest monitoring station: ${responseData.city.name}. No direct data available for ${city}.`;
      }
      
      return res.json({
        success: true,
        data: responseData
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'City not found or no data available'
      });
    }
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching AQI data',
      error: error.message
    });
  }
});

// Get AQI data by geo coordinates
router.get('/geo/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const apiKey = process.env.aqicn;
    
    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        message: 'API key not configured' 
      });
    }

    console.log(`Fetching AQI data for coordinates: ${lat}, ${lng}`);
    
    // Get the nearest city using the coordinates
    const majorCities = [
      { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
      { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
      { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
      { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
      { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
      { name: 'Kolkata', lat: 22.5726, lng: 88.3639 }
    ];
    
    // Calculate distance to each city
    let nearestCity = null;
    let minDistance = Infinity;
    
    for (const city of majorCities) {
      const distance = Math.sqrt(
        Math.pow(parseFloat(lat) - city.lat, 2) + 
        Math.pow(parseFloat(lng) - city.lng, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    }
    
    if (!nearestCity) {
      return res.status(404).json({
        success: false,
        message: 'Could not determine nearest city'
      });
    }
    
    console.log(`Nearest city determined to be: ${nearestCity.name}`);
    
    // Get AQI data for the nearest city
    const response = await axios.get(`https://api.waqi.info/feed/${encodeURIComponent(nearestCity.name)}/?token=${apiKey}`);
    
    if (response.data && response.data.status === 'ok') {
      const aqiData = response.data.data;
      
      return res.json({
        success: true,
        data: {
          city: nearestCity.name,
          coordinates: {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
          },
          distanceToCity: minDistance * 111, // rough conversion to km (1 degree ≈ 111km)
          aqi: aqiData.aqi,
          temperature: aqiData.iaqi.t ? aqiData.iaqi.t.v : null,
          humidity: aqiData.iaqi.h ? parseFloat(aqiData.iaqi.h.v.toFixed(3)) : null,
          wind: aqiData.iaqi.w ? aqiData.iaqi.w.v : null,
          time: aqiData.time
        }
      });
    } else {
      throw new Error('No AQI data received for the nearest city');
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing request',
      error: error.message
    });
  }
});

// Get list of cities with AQI stations
router.get('/cities', async (req, res) => {
  try {
    const apiKey = process.env.aqicn;
    
    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        message: 'API key not configured' 
      });
    }

    // This is a simplified approach - AQICN doesn't have a direct endpoint for listing all cities
    // In a production app, you might want to create your own database of cities with AQI stations
    const cities = [
      { id: 1, name: 'New Delhi', country: 'India' },
      { id: 2, name: 'Mumbai', country: 'India' },
      { id: 3, name: 'Bangalore', country: 'India' },
      { id: 4, name: 'Chennai', country: 'India' },
      { id: 5, name: 'Kolkata', country: 'India' },
      { id: 6, name: 'Hyderabad', country: 'India' },
      { id: 7, name: 'London', country: 'UK' },
      { id: 8, name: 'New York', country: 'USA' },
      { id: 9, name: 'Beijing', country: 'China' },
      { id: 10, name: 'Tokyo', country: 'Japan' }
    ];

    return res.json({
      success: true,
      data: cities
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching cities',
      error: error.message
    });
  }
});
// Historical pollution trends endpoint removed

module.exports = router;
