import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import VehicleDetailsModal from '../components/VehicleDetailsModal';

const VehicleStatistics = () => {
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'exceeding', 'stats'
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    const fetchData = async () => {      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch vehicles based on active tab
        let vehiclesResponse;
        if (activeTab === 'exceeding') {
          vehiclesResponse = await axios.get('/api/vehicles/exceeding');
        } else {
          vehiclesResponse = await axios.get('/api/vehicles');
        }
        
        setVehicles(vehiclesResponse.data.data);
        
        // Fetch stats if on stats tab
        if (activeTab === 'stats') {
          const statsResponse = await axios.get('/api/vehicles/stats');
          setStats(statsResponse.data.data);
        }
      } catch (err) {
        console.error('Error fetching vehicle data:', err);
        setError(err.response?.data?.message || 'Failed to load vehicle data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab]);
  
  const getStatusBadge = (status) => {
    if (status && status.includes('❌')) {
      return <Badge className="bg-red-500 hover:bg-red-600">❌ Exceeding Limit</Badge>;
    } else if (status && status.includes('⚠️')) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">⚠️ Warning</Badge>;
    } else {
      return <Badge className="bg-green-500 hover:bg-green-600">✅ Good</Badge>;
    }
  };

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const closeModal = () => {
    setSelectedVehicle(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Vehicle CO2 Statistics</h1>
        
        <div className="flex space-x-2 mb-6">
          <Button 
            variant={activeTab === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveTab('all')}
          >
            All Vehicles
          </Button>
          <Button 
            variant={activeTab === 'exceeding' ? 'default' : 'outline'}
            onClick={() => setActiveTab('exceeding')}
          >
            Exceeding Limit
          </Button>
          <Button 
            variant={activeTab === 'stats' ? 'default' : 'outline'}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </Button>
        </div>
        
        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center items-center p-8">
                <Loader />
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-6">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                <p className="text-gray-600">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : activeTab === 'stats' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>CO2 Emission Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {stats && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-500">Total Vehicles</p>
                        <p className="text-2xl font-bold">{stats.totalVehicles}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-500">Exceeding Limit</p>
                        <p className="text-2xl font-bold text-red-600">{stats.exceedingCount}</p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-500">Percentage Exceeding</p>
                      <p className="text-2xl font-bold">
                        {stats.exceedingPercentage.toFixed(1)}%
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                          className="bg-red-600 h-2.5 rounded-full" 
                          style={{ width: `${stats.exceedingPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Emissions by Fuel Type</CardTitle>
              </CardHeader>
              <CardContent>
                {stats && stats.fuelTypeStats && stats.fuelTypeStats.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fuel Type</TableHead>
                        <TableHead>Vehicles</TableHead>
                        <TableHead>Avg. CO2 (kg)</TableHead>
                        <TableHead>Total CO2 (kg)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.fuelTypeStats.map((stat, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{stat._id}</TableCell>
                          <TableCell>{stat.totalVehicles}</TableCell>
                          <TableCell>{stat.avgCarbonEmitted.toFixed(2)}</TableCell>
                          <TableCell>{stat.totalCarbonEmitted.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center p-6">
                    <p className="text-gray-500">No fuel type statistics available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'exceeding' ? 'Vehicles Exceeding CO2 Limit' : 'All Vehicles'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vehicles && vehicles.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Number</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Fuel Type</TableHead>
                      <TableHead>CO2 Emitted (kg)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.map((vehicle) => (
                      <TableRow 
                        key={vehicle._id} 
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => handleVehicleClick(vehicle)}
                      >
                        <TableCell className="font-medium">{vehicle.number}</TableCell>
                        <TableCell>{vehicle.name}</TableCell>
                        <TableCell>{vehicle.fuelType}</TableCell>
                        <TableCell>
                          <span className={vehicle.carbonFootprint.carbonEmitted > 15 ? 'text-red-600 font-bold' : ''}>
                            {vehicle.carbonFootprint.carbonEmitted.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(vehicle.carbonFootprint.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-6">
                  <p className="text-gray-500">
                    {activeTab === 'exceeding' 
                      ? 'No vehicles exceeding CO2 emission limits' 
                      : 'No vehicles found'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Vehicle Details Modal */}
        {selectedVehicle && (
          <VehicleDetailsModal 
            vehicle={selectedVehicle} 
            onClose={closeModal} 
          />
        )}
      </div>
    </div>
  );
};

export default VehicleStatistics;
