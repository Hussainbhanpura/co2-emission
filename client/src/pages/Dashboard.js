import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FiAlertTriangle, FiActivity, FiWind, FiMapPin, FiUsers, FiInbox, FiCpu, FiRefreshCw, FiPlus, FiArrowUp, FiArrowDown, FiInfo } from 'react-icons/fi';
import axios from 'axios';
import Loader from '../components/Loader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  
  // State for dashboard data
  const [iotDevices, setIotDevices] = useState({
    total: 127,
    active: 118,
    inactive: 9,
    trend: '+3%'
  });
  
  const [carbonEmissions, setCarbonEmissions] = useState({
    total: 1342.5,
    trend: '-5%',
    hotspots: [
      { name: 'Industrial Zone A', value: 287.3, change: '+2%' },
      { name: 'City Center', value: 195.8, change: '-8%' },
      { name: 'Highway Junction', value: 143.2, change: '-3%' }
    ]
  });
  
  const [aqiData, setAqiData] = useState({
    cities: [
      { name: 'New Delhi', value: 168, category: 'Unhealthy', trend: '-3%' },
      { name: 'Mumbai', value: 82, category: 'Moderate', trend: '+5%' },
      { name: 'Bangalore', value: 56, category: 'Moderate', trend: '-10%' },
      { name: 'Kolkata', value: 112, category: 'Unhealthy for Sensitive Groups', trend: '+2%' }
    ]
  });
  
  const [hotspotAlerts, setHotspotAlerts] = useState([
    { id: 1, location: 'Industrial Zone A', aqi: 215, severity: 'Very Unhealthy', industries: 12 },
    { id: 2, location: 'Highway Junction B', aqi: 178, severity: 'Unhealthy', industries: 5 },
    { id: 3, location: 'Urban District C', aqi: 156, severity: 'Unhealthy', industries: 8 }
  ]);
  
  const [userReports, setUserReports] = useState({
    open: 27,
    resolved: 143,
    types: [
      { type: 'Industrial Smoke', count: 12 },
      { type: 'Vehicle Emissions', count: 8 },
      { type: 'Burning Waste', count: 5 },
      { type: 'Other', count: 2 }
    ]
  });
  
  const [industryRequests, setIndustryRequests] = useState({
    pending: 10,
    approved: 32,
    rejected: 5
  });
  
  const [aiMetrics, setAiMetrics] = useState({
    accuracy: 87,
    responseTime: '1.2s',
    solutionsImplemented: 78,
    userSatisfaction: 92
  });
  
  // Chart data for emissions
  const emissionChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'CO₂ Emissions (tons)',
        data: [1250, 1380, 1420, 1350, 1290, 1320, 1400, 1450, 1380, 1342, 1310, 1290],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };
  
  // Show loading state
  if (loading) {
    return <Loader />;
  }
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Helper function to get color based on AQI value
  const getAqiColor = (value) => {
    if (value <= 50) return 'bg-green-100 text-green-800'; // Good
    if (value <= 100) return 'bg-yellow-100 text-yellow-800'; // Moderate
    if (value <= 150) return 'bg-orange-100 text-orange-800'; // Unhealthy for Sensitive Groups
    if (value <= 200) return 'bg-red-100 text-red-800'; // Unhealthy
    if (value <= 300) return 'bg-purple-100 text-purple-800'; // Very Unhealthy
    return 'bg-rose-100 text-rose-800'; // Hazardous
  };
  
  // Helper function to get trend icon
  const getTrendIcon = (trend) => {
    if (trend.startsWith('+')) {
      return <FiArrowUp className="text-red-500" />;
    } else if (trend.startsWith('-')) {
      return <FiArrowDown className="text-green-500" />;
    }
    return null;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main dashboard content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <FiRefreshCw className="h-4 w-4" /> Refresh Data
            </Button>
            <Button size="sm" className="flex items-center gap-1">
              <FiPlus className="h-4 w-4" /> Generate Report
            </Button>
          </div>
        </div>
        
        {/* Top Summary Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* 1.1 Total Active IoT Devices */}
          <Card className="border-l-4 border-blue-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-gray-500">Active IoT Devices</CardTitle>
                <div className="p-2 bg-blue-100 rounded-full">
                  <FiActivity className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-2xl font-bold">{iotDevices.active}/{iotDevices.total}</p>
                  <p className="text-xs text-gray-500 mt-1">Devices Online</p>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  {getTrendIcon(iotDevices.trend)} {iotDevices.trend}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="text-xs text-blue-600 p-0 h-auto">
                View all devices →
              </Button>
            </CardFooter>
          </Card>

          {/* 1.2 Real-Time Carbon Emission Stats */}
          <Card className="border-l-4 border-green-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-gray-500">Carbon Emissions</CardTitle>
                <div className="p-2 bg-green-100 rounded-full">
                  <FiWind className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-2xl font-bold">{carbonEmissions.total}<span className="text-sm">t</span></p>
                  <p className="text-xs text-gray-500 mt-1">Total CO₂ (tons)</p>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  {getTrendIcon(carbonEmissions.trend)} {carbonEmissions.trend}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="text-xs text-green-600 p-0 h-auto">
                View emission details →
              </Button>
            </CardFooter>
          </Card>

          {/* 1.3 Air Quality Index Snapshot */}
          <Card className="border-l-4 border-yellow-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-gray-500">Air Quality Index</CardTitle>
                <div className="p-2 bg-yellow-100 rounded-full">
                  <FiWind className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{aqiData.cities[0].name}</p>
                  <Badge className={getAqiColor(aqiData.cities[0].value)}>
                    AQI: {aqiData.cities[0].value}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{aqiData.cities[1].name}</p>
                  <Badge className={getAqiColor(aqiData.cities[1].value)}>
                    AQI: {aqiData.cities[1].value}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="text-xs text-yellow-600 p-0 h-auto">
                View all cities →
              </Button>
            </CardFooter>
          </Card>

          {/* 1.4 Hotspot Alerts */}
          <Card className="border-l-4 border-red-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-gray-500">Hotspot Alerts</CardTitle>
                <div className="p-2 bg-red-100 rounded-full">
                  <FiAlertTriangle className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-2xl font-bold">{hotspotAlerts.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Active Alerts</p>
                </div>
                <Badge variant="destructive">
                  Critical
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="text-xs text-red-600 p-0 h-auto">
                View all alerts →
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Main Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Emissions Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Real-Time Carbon Emission Trends</CardTitle>
              <CardDescription>Monthly CO₂ emissions over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line 
                  data={emissionChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: false,
                        title: {
                          display: true,
                          text: 'CO₂ Emissions (tons)'
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">Previous Year</Button>
              <Button variant="outline" size="sm">Export Data</Button>
            </CardFooter>
          </Card>

          {/* Right Column - Top Pollution Hotspots */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pollution Hotspots</CardTitle>
              <CardDescription>Locations with highest emission levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hotspotAlerts.map(hotspot => (
                  <div key={hotspot.id} className="flex items-start p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="p-2 rounded-full bg-red-100 mr-3">
                      <FiMapPin className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{hotspot.location}</h4>
                      <div className="flex items-center mt-1">
                        <Badge className={getAqiColor(hotspot.aqi)}>
                          AQI: {hotspot.aqi}
                        </Badge>
                        <span className="text-xs text-gray-500 ml-2">{hotspot.industries} industries</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <FiInfo className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">View All Hotspots</Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Bottom Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Reports & Complaints */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>User Reports & Complaints</CardTitle>
                <Badge variant="outline">{userReports.open} Open</Badge>
              </div>
              <CardDescription>User-submitted pollution issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-indigo-100 mr-3">
                      <FiUsers className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Total Reports</h4>
                      <p className="text-sm text-gray-500">{userReports.open + userReports.resolved} submissions</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold">{userReports.open + userReports.resolved}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Common Report Types</h4>
                  {userReports.types.map((type, index) => (
                    <div key={index} className="flex justify-between items-center mb-1 last:mb-0">
                      <p className="text-sm">{type.type}</p>
                      <Badge variant="outline">{type.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">View All Reports</Button>
            </CardFooter>
          </Card>

          {/* Pending Industry Requests */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Industry Requests</CardTitle>
                <Badge variant="outline">{industryRequests.pending} Pending</Badge>
              </div>
              <CardDescription>Industries seeking pollution solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xl font-bold text-amber-500">{industryRequests.pending}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xl font-bold text-green-500">{industryRequests.approved}</p>
                    <p className="text-xs text-gray-500">Approved</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xl font-bold text-red-500">{industryRequests.rejected}</p>
                    <p className="text-xs text-gray-500">Rejected</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border border-amber-200 bg-amber-50">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-amber-100 mr-3">
                      <FiInbox className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">New Requests</h4>
                      <p className="text-xs text-gray-500">Awaiting review</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{industryRequests.pending}</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex-1">Reject</Button>
              <Button className="flex-1">Approve</Button>
            </CardFooter>
          </Card>

          {/* AI Solution Accuracy Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>AI Solution Metrics</CardTitle>
              <CardDescription>Performance of AI-generated solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <div className="relative w-32 h-32">
                  <Doughnut 
                    data={{
                      labels: ['Accurate', 'Inaccurate'],
                      datasets: [{
                        data: [aiMetrics.accuracy, 100 - aiMetrics.accuracy],
                        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(229, 231, 235, 0.5)'],
                        borderWidth: 0
                      }]
                    }}
                    options={{
                      cutout: '75%',
                      plugins: {
                        legend: { display: false }
                      }
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <p className="text-2xl font-bold">{aiMetrics.accuracy}%</p>
                    <p className="text-xs text-gray-500">Accuracy</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm">Response Time</p>
                  <p className="font-medium">{aiMetrics.responseTime}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">Solutions Implemented</p>
                  <p className="font-medium">{aiMetrics.solutionsImplemented}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">User Satisfaction</p>
                  <p className="font-medium">{aiMetrics.userSatisfaction}%</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                <FiCpu className="h-4 w-4" /> Optimize AI Model
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
