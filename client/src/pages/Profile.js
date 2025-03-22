import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // User stats
  const [userStats, setUserStats] = useState({
    totalEmissions: 0,
    totalTrips: 0,
    averageEmissionPerTrip: 0,
    emissionReduction: 0
  });
  
  // Generate avatar URL based on user's email
  useEffect(() => {
    if (user?.email) {
      generateAvatar();
    }
  }, [user?.email]);
  
  // Fetch user stats
  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);
  
  const generateAvatar = () => {
    const styles = ['adventurer', 'adventurer-neutral', 'avataaars', 'big-ears', 'big-ears-neutral', 'bottts', 'croodles', 'croodles-neutral'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const url = `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${encodeURIComponent(user.email)}`;
    setAvatarUrl(url);
  };
  
  const fetchUserStats = async () => {
    try {
      // This would be replaced with an actual API call
      // const response = await axios.get('/api/user/stats');
      // setUserStats(response.data);
      
      // Using dummy data for now
      setUserStats({
        totalEmissions: 1250,
        totalTrips: 45,
        averageEmissionPerTrip: 27.8,
        emissionReduction: 15
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setSuccess('');
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      // This would be replaced with an actual API call
      // await axios.post('/api/auth/change-password', {
      //   currentPassword,
      //   newPassword
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast({
        title: "Success",
        description: "Your password has been updated!",
        variant: "success",
      });
    } catch (error) {
      setError('Failed to change password. Please check your current password.');
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img 
                    src={avatarUrl} 
                    alt={user?.name || 'User'} 
                    className="w-32 h-32 rounded-full border-4 border-green-100"
                  />
                  <button 
                    onClick={generateAvatar}
                    className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                    title="Generate new avatar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
                <p className="text-gray-600 mb-4">{user?.email || 'user@example.com'}</p>
                <div className="w-full border-t border-gray-200 pt-4">
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Member since:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Your CO2 Emission Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Emissions</p>
                  <p className="text-2xl font-bold text-gray-800">{userStats.totalEmissions} kg</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Trips</p>
                  <p className="text-2xl font-bold text-gray-800">{userStats.totalTrips}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Avg. Emission per Trip</p>
                  <p className="text-2xl font-bold text-gray-800">{userStats.averageEmissionPerTrip} kg</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Emission Reduction</p>
                  <p className="text-2xl font-bold text-gray-800">{userStats.emissionReduction}%</p>
                </div>
              </div>
            </div>
            
            {/* Password Change Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Change Password</h2>
              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
              {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}
              <form onSubmit={handlePasswordChange}>
                <div className="mb-4">
                  <label htmlFor="currentPassword" className="block text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
