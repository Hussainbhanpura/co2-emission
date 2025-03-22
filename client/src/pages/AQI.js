import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'react-toastify';

// Mock data for development - will be used as fallback if API fails
const mockCities = [
  { id: 1, name: 'New Delhi', country: 'India' },
  { id: 2, name: 'Mumbai', country: 'India' },
  { id: 3, name: 'Bangalore', country: 'India' },
  { id: 4, name: 'Chennai', country: 'India' },
  { id: 5, name: 'Kolkata', country: 'India' },
  { id: 6, name: 'Hyderabad', country: 'India' },
];

// Mock data for AQI
const mockAQIData = {
  aqi: 148,
  category: 'Unhealthy for Sensitive Groups',
  color: '#FF9E01',
  dominantPollutant: 'PM2.5',
  timestamp: new Date().toISOString(),
  weather: {
    temperature: 32,
    humidity: 65,
    windSpeed: 8,
    windDirection: 'NE',
  },
  pollutants: {
    pm25: { concentration: 48.5, unit: 'µg/m³', category: 'Unhealthy for Sensitive Groups' },
    pm10: { concentration: 78.2, unit: 'µg/m³', category: 'Moderate' },
    o3: { concentration: 42.1, unit: 'ppb', category: 'Good' },
    no2: { concentration: 22.8, unit: 'ppb', category: 'Good' },
    so2: { concentration: 5.2, unit: 'ppb', category: 'Good' },
    co: { concentration: 0.8, unit: 'ppm', category: 'Good' },
  },
  healthRecommendations: {
    general: 'Consider reducing prolonged or heavy exertion outdoors.',
    sensitiveGroups: 'People with respiratory or heart disease, the elderly and children should limit prolonged exertion.',
  }
};

// Historical data for charts
const mockHistoricalData = {
  hourly: Array(24).fill().map((_, i) => ({
    time: `${i}:00`,
    pm25: Math.floor(Math.random() * 80) + 20,
    pm10: Math.floor(Math.random() * 100) + 30,
    o3: Math.floor(Math.random() * 50) + 10,
    no2: Math.floor(Math.random() * 30) + 5,
  })),
  daily: Array(7).fill().map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      pm25: Math.floor(Math.random() * 80) + 20,
      pm10: Math.floor(Math.random() * 100) + 30,
      o3: Math.floor(Math.random() * 50) + 10,
      no2: Math.floor(Math.random() * 30) + 5,
    };
  }).reverse(),
};

// Mock news data
const mockNews = [
  {
    id: 1,
    title: 'Air Pollution Levels Rise in Major Cities Post-Diwali',
    summary: 'Air quality deteriorates to hazardous levels in several cities after festival celebrations.',
    date: '2025-03-20',
    source: 'Environmental News Network',
    image: 'https://images.unsplash.com/photo-1575353184887-9651ed7c9c9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 2,
    title: 'New Study Links Air Pollution to Increased COVID-19 Severity',
    summary: 'Research indicates that long-term exposure to air pollution may increase vulnerability to respiratory infections.',
    date: '2025-03-18',
    source: 'Health Research Journal',
    image: 'https://images.unsplash.com/photo-1584118624012-df056829fbd0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 3,
    title: 'Government Announces New Measures to Combat Air Pollution',
    summary: 'New policies aim to reduce industrial emissions and promote cleaner transportation options.',
    date: '2025-03-15',
    source: 'Policy Today',
    image: 'https://images.unsplash.com/photo-1573511860302-28c524319d2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
  },
];

// Helper function to get color based on AQI value
const getAQIColor = (aqi) => {
  if (aqi <= 50) return '#00E400'; // Good
  if (aqi <= 100) return '#FFFF00'; // Moderate
  if (aqi <= 150) return '#FF9E01'; // Unhealthy for Sensitive Groups
  if (aqi <= 200) return '#FF0000'; // Unhealthy
  if (aqi <= 300) return '#8F3F97'; // Very Unhealthy
  return '#7E0023'; // Hazardous
};

// Helper function to get category based on AQI value
const getAQICategory = (aqi) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

// Helper function to get text color based on background color
const getTextColor = (backgroundColor) => {
  // For yellow and green backgrounds, use dark text
  if (backgroundColor === '#00E400' || backgroundColor === '#FFFF00') {
    return '#333333';
  }
  // For all other colors (orange, red, purple, maroon), use white text
  return '#FFFFFF';
};

// Helper function to get icon for weather condition
const getWeatherIcon = (temperature) => {
  if (temperature > 30) return '☀️'; // Hot
  if (temperature > 20) return '🌤️'; // Warm
  if (temperature > 10) return '⛅'; // Mild
  return '❄️'; // Cold
};

// Helper function to get icon for pollutant
const getPollutantIcon = (pollutant) => {
  switch(pollutant) {
    case 'pm25': return '🔬'; // Microscopic
    case 'pm10': return '💨'; // Dust
    case 'o3': return '⚡'; // Ozone
    case 'no2': return '🏭'; // Industrial
    case 'so2': return '🌋'; // Volcanic/Industrial
    case 'co': return '🚗'; // Vehicle emissions
    default: return '💭';
  }
};

const AQI = () => {
  const [cities, setCities] = useState(mockCities);
  const [selectedCity, setSelectedCity] = useState(mockCities[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [aqiData, setAqiData] = useState(mockAQIData);
  const [historicalData, setHistoricalData] = useState(mockHistoricalData);
  const [news, setNews] = useState(mockNews);
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [error, setError] = useState(null);
  const [citySearchResults, setCitySearchResults] = useState([]);
  const [citySearchLoading, setCitySearchLoading] = useState(false);

  // Search for cities using AccuWeather API
  useEffect(() => {
    // Track if the component is mounted to prevent state updates after unmount
    let isMounted = true;
    
    if (searchQuery.length >= 2) {
      const searchCities = async () => {
        if (!isMounted) return;
        setCitySearchLoading(true);
        
        try {
          // Add a cache key to prevent duplicate requests
          const cacheKey = `city_search_${searchQuery}`;
          const cachedResults = sessionStorage.getItem(cacheKey);
          
          if (cachedResults) {
            // Use cached results if available
            const parsedResults = JSON.parse(cachedResults);
            setCitySearchResults(parsedResults);
            setCities(parsedResults);
          } else {
            // Make API request if no cache available
            const response = await axios.get(`/api/weather/cities/search/${searchQuery}`);
            
            if (response.data.success && isMounted) {
              setCitySearchResults(response.data.data);
              // Update the cities list with search results
              setCities(response.data.data);
              
              // Cache the results for 1 hour
              sessionStorage.setItem(cacheKey, JSON.stringify(response.data.data));
            }
          }
        } catch (error) {
          console.error('Error searching for cities:', error);
          if (isMounted) {
            // Fallback to filtering mock cities
            const filteredMockCities = mockCities.filter(city => 
              city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              city.country.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setCities(filteredMockCities);
            toast.warning('Using local city data due to API limitations');
          }
        } finally {
          if (isMounted) {
            setCitySearchLoading(false);
          }
        }
      };
      
      // Debounce search to avoid too many API calls
      const timeoutId = setTimeout(() => {
        searchCities();
      }, 800); // Increased debounce time to reduce API calls
      
      return () => {
        clearTimeout(timeoutId);
        isMounted = false;
      };
    } else if (searchQuery.length === 0) {
      // If search is cleared, fetch initial cities list
      fetchInitialCities();
    }
    
    return () => {
      isMounted = false;
    };
  }, [searchQuery]);

  // Fetch initial cities list
  const fetchInitialCities = async () => {
    // Check if we have cached cities data
    const cachedCities = sessionStorage.getItem('initial_cities');
    
    if (cachedCities) {
      try {
        const parsedCities = JSON.parse(cachedCities);
        setCities(parsedCities);
        
        // Set the first city as default if we don't have a selected city yet
        if (!selectedCity && parsedCities.length > 0) {
          setSelectedCity(parsedCities[0]);
        }
        console.log('Using cached cities data');
        return;
      } catch (parseError) {
        console.error('Error parsing cached cities:', parseError);
        // Continue to fetch from API if cache parsing fails
      }
    }
    
    try {
      const response = await axios.get('/api/aqi/cities');
      if (response.data.success) {
        const citiesData = response.data.data;
        setCities(citiesData);
        
        // Cache the cities data
        sessionStorage.setItem('initial_cities', JSON.stringify(citiesData));
        
        // Set the first city as default if we don't have a selected city yet
        if (!selectedCity && citiesData.length > 0) {
          setSelectedCity(citiesData[0]);
        }
      } else {
        throw new Error('Failed to fetch cities data');
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      // Fallback to mock data if API fails
      setCities(mockCities);
      toast.warning('Using local city data due to API limitations');
    }
  };

  // Fetch initial cities on component mount - only once
  useEffect(() => {
    let isMounted = true;
    
    if (isMounted) {
      fetchInitialCities();
    }
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Get user's location on component mount
  useEffect(() => {
    let isMounted = true;
    
    const getUserLocation = async () => {
      if (!isMounted) return;
      
      setLocationLoading(true);
      setError(null);
      
      // Check if we have cached location data
      const cachedLocation = localStorage.getItem('user_location');
      if (cachedLocation) {
        try {
          const parsedLocation = JSON.parse(cachedLocation);
          const timestamp = parsedLocation.timestamp || 0;
          const now = Date.now();
          
          // Only use cached location if it's less than 1 hour old
          if (now - timestamp < 3600000) { // 1 hour in milliseconds
            console.log('Using cached location data');
            
            setUserLocation(parsedLocation);
            
            // Add this city to our list if it's not already there
            const cityExists = cities.some(city => city.id === parsedLocation.city.id);
            if (!cityExists && isMounted) {
              setCities(prevCities => [parsedLocation.city, ...prevCities]);
            }
            
            // Set the selected city to the user's location
            if (isMounted) {
              setSelectedCity(parsedLocation.city);
              setLocationLoading(false);
              toast.info(`Using your saved location: ${parsedLocation.city.name}`);
            }
            
            return;
          }
        } catch (parseError) {
          console.error('Error parsing cached location:', parseError);
          // Continue to fetch new location if cache parsing fails
        }
      }
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            if (!isMounted) return;
            
            try {
              const { latitude, longitude } = position.coords;
              
              // Create cache key for this specific location
              const locationCacheKey = `geo_${Math.round(latitude * 100) / 100}_${Math.round(longitude * 100) / 100}`;
              const cachedCityData = sessionStorage.getItem(locationCacheKey);
              
              let locationData;
              
              if (cachedCityData) {
                // Use cached city data if available
                locationData = JSON.parse(cachedCityData);
                console.log('Using cached city data for coordinates');
              } else {
                // Fetch city data from AccuWeather API based on coordinates
                try {
                  const weatherResponse = await axios.get(`/api/weather/cities/geo/${latitude}/${longitude}`);
                  
                  if (weatherResponse.data.success) {
                    locationData = weatherResponse.data.data;
                    
                    // Cache the city data
                    sessionStorage.setItem(locationCacheKey, JSON.stringify(locationData));
                  } else {
                    throw new Error('Could not determine your city from coordinates');
                  }
                } catch (apiError) {
                  console.error('Error fetching city by coordinates:', apiError);
                  
                  // Check if we received fallback data
                  if (apiError.response && apiError.response.data && apiError.response.data.data) {
                    locationData = apiError.response.data.data;
                    toast.warning('Using approximate location data due to API limitations');
                  } else {
                    throw new Error('Could not determine your city from coordinates');
                  }
                }
              }
              
              // Create a city object from the location data
              const userCity = {
                id: locationData.id,
                name: locationData.name,
                country: locationData.country,
                administrativeArea: locationData.administrativeArea
              };
              
              // Create the full location object
              const userLocationObject = {
                lat: latitude,
                lng: longitude,
                city: userCity,
                timestamp: Date.now() // Add timestamp for cache expiration
              };
              
              // Set user location
              if (isMounted) {
                setUserLocation(userLocationObject);
                
                // Cache the location data in localStorage (persists between sessions)
                localStorage.setItem('user_location', JSON.stringify(userLocationObject));
                
                // Add this city to our list if it's not already there
                const cityExists = cities.some(city => city.id === userCity.id);
                if (!cityExists) {
                  setCities(prevCities => [userCity, ...prevCities]);
                }
                
                // Set the selected city to the user's location
                setSelectedCity(userCity);
                setLocationLoading(false);
                
                toast.success(`Located you in ${userCity.name}, ${userCity.administrativeArea}, ${userCity.country}`);
              }
            } catch (error) {
              console.error('Error getting location details:', error);
              if (isMounted) {
                setLocationLoading(false);
                setError('Could not determine your city. Please select manually.');
                toast.error('Could not determine your city. Please select manually.');
                
                // Fallback to a default city
                if (cities.length > 0) {
                  setSelectedCity(cities[0]);
                }
              }
            }
          },
          (error) => {
            console.error('Geolocation error:', error);
            if (isMounted) {
              setLocationLoading(false);
              setError('Location access denied. Please select your city manually.');
              toast.error('Location access denied. Please select your city manually.');
              
              // Fallback to a default city
              if (cities.length > 0) {
                setSelectedCity(cities[0]);
              }
            }
          },
          { timeout: 10000, maximumAge: 3600000 } // Use cached position if available and less than 1 hour old
        );
      } else {
        if (isMounted) {
          setLocationLoading(false);
          setError('Geolocation is not supported by your browser. Please select your city manually.');
          toast.error('Geolocation is not supported by your browser. Please select your city manually.');
          
          // Fallback to a default city
          if (cities.length > 0) {
            setSelectedCity(cities[0]);
          }
        }
      }
    };

    getUserLocation();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper function to get health recommendations based on AQI value
  const getHealthRecommendations = (aqi) => {
    if (aqi <= 50) {
      return {
        general: 'Air quality is satisfactory, and air pollution poses little or no risk.',
        sensitiveGroups: 'None.'
      };
    } else if (aqi <= 100) {
      return {
        general: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.',
        sensitiveGroups: 'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.'
      };
    } else if (aqi <= 150) {
      return {
        general: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
        sensitiveGroups: 'People with respiratory or heart disease, the elderly and children should limit prolonged exertion.'
      };
    } else if (aqi <= 200) {
      return {
        general: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.',
        sensitiveGroups: 'People with respiratory or heart disease, the elderly and children should avoid prolonged exertion; everyone else should limit prolonged exertion.'
      };
    } else if (aqi <= 300) {
      return {
        general: 'Health alert: The risk of health effects is increased for everyone.',
        sensitiveGroups: 'People with respiratory or heart disease, the elderly and children should avoid any outdoor activity; everyone else should avoid prolonged exertion.'
      };
    } else {
      return {
        general: 'Health warning of emergency conditions: everyone is more likely to be affected.',
        sensitiveGroups: 'Everyone should avoid all physical activity outdoors.'
      };
    }
  };

  // Fetch AQI data for selected city
  useEffect(() => {
    if (!selectedCity) return;
    
    let isMounted = true;
    let requestCancelled = false;
    let toastShown = false; // Flag to track if a toast has been shown for this fetch
    
    const fetchAQIData = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      // Check if we have cached AQI data for this city
      const cacheKey = `aqi_data_${selectedCity.name}`;
      const cachedData = sessionStorage.getItem(cacheKey);
      
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          const timestamp = new Date(parsedData.timestamp).getTime();
          const now = Date.now();
          
          // Only use cached data if it's less than 30 minutes old
          if (now - timestamp < 1800000) { // 30 minutes in milliseconds
            console.log(`Using cached AQI data for ${selectedCity.name}`);
            
            if (isMounted) {
              setAqiData(parsedData);
              setLoading(false);
              
              // Only show toast if none has been shown yet
              if (!toastShown) {
                toast.info(`Showing recent air quality data for ${selectedCity.name}`);
                toastShown = true;
              }
              
              // Still load historical data if available
              if (parsedData.historicalData) {
                setHistoricalData(parsedData.historicalData);
              }
              
              return;
            }
          }
        } catch (parseError) {
          console.error('Error parsing cached AQI data:', parseError);
          // Continue to fetch new data if cache parsing fails
        }
      }
      
      // Create an AbortController to cancel the request if the component unmounts
      const controller = new AbortController();
      const signal = controller.signal;
      
      try {
        const response = await axios.get(`/api/aqi/city/${selectedCity.name}`, { signal });
        
        if (requestCancelled) return;
        
        if (response.data.success) {
          const apiData = response.data.data;
          
          // Transform API data to match our app's data structure
          const transformedData = {
            aqi: apiData.aqi,
            category: getAQICategory(apiData.aqi),
            color: getAQIColor(apiData.aqi),
            dominantPollutant: apiData.dominentpol || 'pm25',
            timestamp: new Date().toISOString(),
            weather: {
              temperature: apiData.iaqi.t ? apiData.iaqi.t.v : 25,
              humidity: apiData.iaqi.h ? apiData.iaqi.h.v : 50,
              windSpeed: apiData.iaqi.w ? apiData.iaqi.w.v : 5,
              windDirection: apiData.iaqi.wd ? apiData.iaqi.wd.v : 'N',
            },
            pollutants: {
              pm25: { 
                concentration: apiData.iaqi.pm25 ? apiData.iaqi.pm25.v : 0, 
                unit: 'µg/m³',
                category: getAQICategory(apiData.iaqi.pm25 ? apiData.iaqi.pm25.v * 2 : 0) // Approximate conversion
              },
              pm10: { 
                concentration: apiData.iaqi.pm10 ? apiData.iaqi.pm10.v : 0, 
                unit: 'µg/m³',
                category: getAQICategory(apiData.iaqi.pm10 ? apiData.iaqi.pm10.v : 0)
              },
              o3: { 
                concentration: apiData.iaqi.o3 ? apiData.iaqi.o3.v : 0, 
                unit: 'ppb',
                category: getAQICategory(apiData.iaqi.o3 ? apiData.iaqi.o3.v * 2 : 0) // Approximate conversion
              },
              no2: { 
                concentration: apiData.iaqi.no2 ? apiData.iaqi.no2.v : 0, 
                unit: 'ppb',
                category: getAQICategory(apiData.iaqi.no2 ? apiData.iaqi.no2.v * 2 : 0) // Approximate conversion
              },
              so2: { 
                concentration: apiData.iaqi.so2 ? apiData.iaqi.so2.v : 0, 
                unit: 'ppb',
                category: getAQICategory(apiData.iaqi.so2 ? apiData.iaqi.so2.v * 5 : 0) // Approximate conversion
              },
              co: { 
                concentration: apiData.iaqi.co ? apiData.iaqi.co.v / 1000 : 0, // Convert to ppm
                unit: 'ppm',
                category: getAQICategory(apiData.iaqi.co ? apiData.iaqi.co.v / 10 : 0) // Approximate conversion
              },
            },
            healthRecommendations: getHealthRecommendations(apiData.aqi)
          };
          
          // Process historical data if available
          let historicalDataObj = null;
          
          if (apiData.forecast && apiData.forecast.daily) {
            const historicalPm25 = apiData.forecast.daily.pm25 || [];
            const historicalPm10 = apiData.forecast.daily.pm10 || [];
            const historicalO3 = apiData.forecast.daily.o3 || [];
            
            // Create daily historical data
            const dailyData = historicalPm25.map((item, index) => {
              const date = new Date(item.day);
              return {
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                pm25: item.avg,
                pm10: historicalPm10[index] ? historicalPm10[index].avg : 0,
                o3: historicalO3[index] ? historicalO3[index].avg : 0,
                no2: Math.floor(Math.random() * 30) + 5, // Mock data for NO2 since it might not be available
              };
            });
            
            // Create hourly data (mock since hourly forecast might not be available)
            const hourlyData = Array(24).fill().map((_, i) => ({
              time: `${i}:00`,
              pm25: Math.floor(transformedData.pollutants.pm25.concentration * (0.8 + Math.random() * 0.4)),
              pm10: Math.floor(transformedData.pollutants.pm10.concentration * (0.8 + Math.random() * 0.4)),
              o3: Math.floor(transformedData.pollutants.o3.concentration * (0.8 + Math.random() * 0.4)),
              no2: Math.floor(transformedData.pollutants.no2.concentration * (0.8 + Math.random() * 0.4)),
            }));
            
            historicalDataObj = {
              daily: dailyData,
              hourly: hourlyData
            };
            
            if (isMounted) {
              setHistoricalData(historicalDataObj);
            }
          }
          
          // Add historical data to the transformed data for caching
          transformedData.historicalData = historicalDataObj;
          
          // Cache the data
          sessionStorage.setItem(cacheKey, JSON.stringify(transformedData));
          
          if (isMounted) {
            setAqiData(transformedData);
            setLoading(false);
            
            // Only show toast if none has been shown yet
            if (!toastShown) {
              toast.success(`Latest air quality data for ${selectedCity.name} has been loaded.`);
              toastShown = true;
            }
          }
        } else {
          throw new Error('Failed to fetch AQI data');
        }
      } catch (error) {
        if (error.name === 'AbortError' || requestCancelled) {
          console.log('AQI data fetch aborted');
          return;
        }
        
        console.error('Error fetching AQI data:', error);
        
        if (isMounted) {
          setError('Could not fetch AQI data. Using mock data instead.');
          
          // Only show toast if none has been shown yet
          if (!toastShown) {
            toast.error('Could not fetch AQI data. Using mock data instead.');
            toastShown = true;
          }
          
          // Fallback to mock data with some variation based on city
          const cityIndex = cities.findIndex(city => city.id === selectedCity.id);
          const variationFactor = (cityIndex + 1) * 0.2;
          
          const newAqiData = {
            ...mockAQIData,
            aqi: Math.floor(mockAQIData.aqi * (1 + (Math.random() - 0.5) * variationFactor)),
            timestamp: new Date().toISOString(),
            pollutants: {
              ...mockAQIData.pollutants,
              pm25: { 
                ...mockAQIData.pollutants.pm25, 
                concentration: Math.floor(mockAQIData.pollutants.pm25.concentration * (1 + (Math.random() - 0.5) * variationFactor)) 
              },
              pm10: { 
                ...mockAQIData.pollutants.pm10, 
                concentration: Math.floor(mockAQIData.pollutants.pm10.concentration * (1 + (Math.random() - 0.5) * variationFactor)) 
              },
            }
          };
          
          // Update category and color based on new AQI value
          newAqiData.category = getAQICategory(newAqiData.aqi);
          newAqiData.color = getAQIColor(newAqiData.aqi);
          
          // Cache the mock data too, but with a shorter expiration
          newAqiData.historicalData = historicalData;
          sessionStorage.setItem(cacheKey, JSON.stringify(newAqiData));
          
          setAqiData(newAqiData);
          setLoading(false);
        }
      }
    };
    
    fetchAQIData();
    
    return () => {
      isMounted = false;
      requestCancelled = true;
    };
  }, [selectedCity, cities, historicalData]);



  // Handle city selection
  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const city = cities.find(city => city.id.toString() === cityId.toString());
    if (city) {
      setSelectedCity(city);
    }
  };

  // Filter cities based on search query
  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (city.country && city.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (city.administrativeArea && city.administrativeArea.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Create a mock chart visualization using divs
  const renderMockChart = () => {
    const data = timeRange === '24h' ? historicalData.hourly : historicalData.daily;
    const maxValue = Math.max(...data.map(item => Math.max(item.pm25, item.pm10, item.o3, item.no2)));
    
    return (
      <div className="flex items-end h-64 space-x-1 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col-reverse">
              <div 
                className="w-full bg-blue-500 rounded-t" 
                style={{ 
                  height: `${(item.pm25 / maxValue) * 100}%`,
                  minHeight: '4px'
                }}
                title={`PM2.5: ${item.pm25}`}
              ></div>
              <div 
                className="w-full bg-green-500 rounded-t" 
                style={{ 
                  height: `${(item.pm10 / maxValue) * 100}%`,
                  minHeight: '4px'
                }}
                title={`PM10: ${item.pm10}`}
              ></div>
              <div 
                className="w-full bg-purple-500 rounded-t" 
                style={{ 
                  height: `${(item.o3 / maxValue) * 100}%`,
                  minHeight: '4px'
                }}
                title={`O3: ${item.o3}`}
              ></div>
              <div 
                className="w-full bg-red-500 rounded-t" 
                style={{ 
                  height: `${(item.no2 / maxValue) * 100}%`,
                  minHeight: '4px'
                }}
                title={`NO2: ${item.no2}`}
              ></div>
            </div>
            <span className="text-xs mt-1 text-gray-600">
              {timeRange === '24h' ? item.time : item.date}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Create a mock map visualization
  const renderMockMap = () => {
    // Generate random positions for cities on the "map"
    const cityMarkers = mockCities.map((city, index) => {
      const x = 10 + (index % 3) * 30;
      const y = 10 + Math.floor(index / 3) * 30;
      const aqi = 50 + Math.floor(Math.random() * 200);
      const color = getAQIColor(aqi);
      
      return (
        <div 
          key={city.id}
          className="absolute rounded-full border-2 border-white shadow-md flex items-center justify-center text-xs font-bold"
          style={{ 
            left: `${x}%`, 
            top: `${y}%`, 
            width: '40px',
            height: '40px',
            backgroundColor: color,
            color: getTextColor(color)
          }}
          title={`${city.name}: AQI ${aqi}`}
        >
          {aqi}
        </div>
      );
    });
    
    return (
      <div className="relative w-full h-full bg-blue-50 rounded-lg overflow-hidden">
        {/* Simplified map background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[20%] left-[10%] w-[30%] h-[25%] bg-green-300 rounded-full"></div>
          <div className="absolute top-[50%] left-[40%] w-[40%] h-[30%] bg-green-300 rounded-full"></div>
          <div className="absolute top-[30%] left-[70%] w-[20%] h-[20%] bg-green-300 rounded-full"></div>
          <div className="absolute top-[10%] left-[50%] w-[15%] h-[15%] bg-blue-300 rounded-full"></div>
          <div className="absolute top-[60%] left-[20%] w-[25%] h-[25%] bg-blue-300 rounded-full"></div>
          
          {/* Roads */}
          <div className="absolute top-[30%] left-0 w-[100%] h-[2px] bg-gray-400"></div>
          <div className="absolute top-0 left-[30%] w-[2px] h-[100%] bg-gray-400"></div>
          <div className="absolute top-0 left-[70%] w-[2px] h-[100%] bg-gray-400"></div>
          <div className="absolute top-[70%] left-0 w-[100%] h-[2px] bg-gray-400"></div>
        </div>
        
        {/* City markers */}
        {cityMarkers}
        
        {/* Legend */}
        <div className="absolute bottom-2 right-2 bg-white p-2 rounded shadow-md">
          <div className="text-xs font-bold mb-1">AQI Legend</div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00E400' }}></div>
            <span className="text-xs">Good</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFFF00' }}></div>
            <span className="text-xs">Moderate</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF9E01' }}></div>
            <span className="text-xs">Unhealthy for Sensitive Groups</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF0000' }}></div>
            <span className="text-xs">Unhealthy</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Air Quality Index Monitor</h1>
          <p className="text-gray-600">Real-time air quality data and pollution trends</p>
        </div>
        <div className="w-full md:w-64">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2"
            />
            {citySearchLoading && (
              <div className="absolute right-3 top-3">
                <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
          {locationLoading ? (
            <div className="w-full p-2 border rounded-md bg-gray-50 text-gray-500 flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Detecting location...
            </div>
          ) : (
            <select 
              className="w-full p-2 border rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              onChange={handleCityChange} 
              value={selectedCity?.id || ''}
            >
              {filteredCities.length > 0 ? (
                filteredCities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}{city.administrativeArea ? `, ${city.administrativeArea}` : ''}, {city.country}
                  </option>
                ))
              ) : (
                <option value="" disabled>No cities found</option>
              )}
            </select>
          )}
          {userLocation && (
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Using your location
            </div>
          )}
        </div>
      </div>

      {/* Main AQI Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader 
            style={{ 
              background: `linear-gradient(135deg, ${aqiData.color}, ${aqiData.color}CC)`,
              color: getTextColor(aqiData.color)
            }}
            className="pb-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-5xl font-bold mb-1">{aqiData.aqi}</CardTitle>
                <CardDescription 
                  className="text-lg font-semibold" 
                  style={{ color: getTextColor(aqiData.color) === '#FFFFFF' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)' }}
                >
                  {aqiData.category}
                </CardDescription>
              </div>
              <div className="text-4xl">
                {getWeatherIcon(aqiData.weather.temperature)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="flex justify-between items-center mb-6 bg-white p-3 rounded-lg shadow-sm">
              <div className="text-center">
                <p className="text-sm text-gray-500">Temperature</p>
                <p className="font-semibold text-lg">{aqiData.weather.temperature}°C</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Humidity</p>
                <p className="font-semibold text-lg">{aqiData.weather.humidity}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Wind</p>
                <p className="font-semibold text-lg">{aqiData.weather.windSpeed} km/h</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="font-semibold mb-2 text-gray-800">Health Recommendations:</p>
              <div className="bg-blue-50 p-3 rounded-lg mb-2">
                <p className="text-sm text-gray-700">{aqiData.healthRecommendations.general}</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{aqiData.healthRecommendations.sensitiveGroups}</p>
              </div>
            </div>
            <div className="border-t mt-4 pt-4">
              <p className="text-xs text-gray-500">Last updated: {new Date(aqiData.timestamp).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
            <CardTitle>Pollutant Levels</CardTitle>
            <CardDescription>Current concentration of major air pollutants</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(aqiData.pollutants).map(([key, pollutant]) => {
                const color = 
                  pollutant.category === 'Good' ? '#00E400' : 
                  pollutant.category === 'Moderate' ? '#FFFF00' : 
                  pollutant.category === 'Unhealthy for Sensitive Groups' ? '#FF9E01' : 
                  pollutant.category === 'Unhealthy' ? '#FF0000' : 
                  pollutant.category === 'Very Unhealthy' ? '#8F3F97' : '#7E0023';
                
                return (
                  <div 
                    key={key} 
                    className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                    style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">{getPollutantIcon(key)}</span>
                      <p className="text-sm font-semibold uppercase text-gray-700">{key}</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{pollutant.concentration}</p>
                    <p className="text-xs text-gray-500">{pollutant.unit}</p>
                    <div 
                      className="mt-2 px-2 py-1 rounded-full text-xs font-medium inline-block"
                      style={{ 
                        backgroundColor: `${color}33`, // Add transparency
                        color: pollutant.category === 'Good' || pollutant.category === 'Moderate' ? '#333' : color
                      }}
                    >
                      {pollutant.category}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Data Charts */}
      <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Pollution Trends</CardTitle>
              <CardDescription>Historical data for key pollutants</CardDescription>
            </div>
            <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm">
              <Button 
                variant={timeRange === '24h' ? 'default' : 'outline'} 
                onClick={() => setTimeRange('24h')}
                className="text-sm"
              >
                24 Hours
              </Button>
              <Button 
                variant={timeRange === '7d' ? 'default' : 'outline'} 
                onClick={() => setTimeRange('7d')}
                className="text-sm"
              >
                7 Days
              </Button>
              <Button 
                variant={timeRange === '1m' ? 'default' : 'outline'} 
                onClick={() => setTimeRange('1m')}
                className="text-sm"
              >
                1 Month
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-white p-6">
          {renderMockChart()}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-blue-50">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm text-blue-700 font-medium">PM2.5</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-green-50">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm text-green-700 font-medium">PM10</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-purple-50">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <span className="text-sm text-purple-700 font-medium">O₃</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-red-50">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm text-red-700 font-medium">NO₂</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AQI Map */}
      <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardTitle>AQI Map</CardTitle>
          <CardDescription>Real-time air quality across different locations</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[400px] w-full">
            {renderMockMap()}
          </div>
        </CardContent>
      </Card>

      {/* News & Insights */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-blue-50">
          <CardTitle>Air Quality News & Insights</CardTitle>
          <CardDescription>Latest updates on air pollution and environmental policies</CardDescription>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map(item => (
              <Card key={item.id} className="border overflow-hidden hover:shadow-md transition-shadow duration-300">
                {item.image && (
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader className="pb-2 bg-gradient-to-b from-gray-50 to-white">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{item.summary}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-blue-600 font-medium">{item.source}</span>
                    <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{item.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AQI;
