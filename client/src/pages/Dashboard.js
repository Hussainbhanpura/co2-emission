import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  
  // Show loading state
  if (loading) {
    return <Loader />;
  }
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>CO2 Emissions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Track and monitor your carbon footprint</p>
              <Button>View Emissions</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Connect with others and share your progress</p>
              <Link to="/community">
                <Button>Go to Community</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tips & Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Learn how to reduce your carbon footprint</p>
              <Button variant="outline">Explore Resources</Button>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Carbon Footprint Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-6 rounded-md border border-dashed border-gray-300 text-center">
              <p className="text-gray-500">Your emissions data will be displayed here</p>
              <p className="text-gray-400 text-sm mt-2">Start tracking your emissions to see your data</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
