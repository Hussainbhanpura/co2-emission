import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const VehicleDetailsModal = ({ vehicle, onClose }) => {
  if (!vehicle) return null;

  const getStatusBadge = (status) => {
    if (status && status.includes('❌')) {
      return <Badge className="bg-red-500 hover:bg-red-600">❌ Exceeding Limit</Badge>;
    } else if (status && status.includes('⚠️')) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">⚠️ Warning</Badge>;
    } else {
      return <Badge className="bg-green-500 hover:bg-green-600">✅ Good</Badge>;
    }
  };

  // Format date strings to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString; // Return the original string if it can't be parsed as a date
    }
  };

  // Handle click outside to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-3xl">
        <CardHeader className="relative border-b pb-2">
          <Button 
            className="absolute right-2 top-2 h-6 w-6 p-0 rounded-full" 
            variant="outline"
            onClick={onClose}
          >
            ×
          </Button>
          <CardTitle className="text-xl flex items-center gap-2">
            {vehicle.name || 'Vehicle'}
            <span className="text-sm font-normal text-gray-500">{vehicle.number}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Vehicle Information</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-sm">{vehicle.type || 'Car'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Fuel Type</p>
                  <p className="text-sm">{vehicle.fuelType || 'N/A'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Year</p>
                  <p className="text-sm">{vehicle.yearOfManufacture || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm">{vehicle.status || 'Active'}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Contact</p>
                <p className="text-sm">{vehicle.contact || 'N/A'}</p>
              </div>

              <h3 className="text-base font-semibold mt-3">Owner Information</h3>
              <div className="grid grid-cols-1 gap-2 border p-2 rounded-md bg-gray-50">
                <div>
                  <p className="text-xs text-gray-500">Owner Name</p>
                  <p className="text-sm">{vehicle.ownerName || 'John Doe'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm">{vehicle.ownerLocation || 'Not available'}</p>
                </div>
                <div className="text-xs text-gray-400 italic">
                  Owner information will be fetched from RTO API in the future
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold">Carbon Footprint</h3>
              
              <div className="border p-2 rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-base font-bold">
                    {vehicle.carbonFootprint?.carbonEmitted?.toFixed(2) || '0'} kg
                  </span>
                  {getStatusBadge(vehicle.carbonFootprint?.status)}
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Distance Travelled</p>
                    <p className="text-sm">{vehicle.carbonFootprint?.distanceTravelled || '0'} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fuel Efficiency</p>
                    <p className="text-sm">{vehicle.carbonFootprint?.fuelEfficiency || '0'} km/L</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Checked</p>
                    <p className="text-sm">{formatDate(vehicle.lastChecked)}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-base font-semibold mt-3">Registration Details</h3>
              <div className="border p-2 rounded-md bg-gray-50 space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Issued At</p>
                  <p className="text-sm">{vehicle.issuedAt || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Issue Date</p>
                  <p className="text-sm">{formatDate(vehicle.issueDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Valid From</p>
                  <p className="text-sm">{formatDate(vehicle.validFromDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Expiry Date</p>
                  <p className="text-sm">{formatDate(vehicle.expiryDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleDetailsModal;
