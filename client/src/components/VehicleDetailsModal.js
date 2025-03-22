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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative border-b pb-3">
          <Button 
            className="absolute right-2 top-2 h-8 w-8 p-0 rounded-full" 
            variant="outline"
            onClick={onClose}
          >
            ×
          </Button>
          <CardTitle className="text-2xl flex items-center gap-3">
            {vehicle.name}
            <span className="text-base font-normal text-gray-500">{vehicle.number}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vehicle Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{vehicle.type || 'Car'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fuel Type</p>
                  <p className="font-medium">{vehicle.fuelType}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-medium">{vehicle.yearOfManufacture || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{vehicle.status || 'Active'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{vehicle.contact || 'N/A'}</p>
              </div>

              <h3 className="text-lg font-semibold mt-6">Owner Information</h3>
              <div className="grid grid-cols-1 gap-4 border p-4 rounded-md bg-gray-50">
                <div>
                  <p className="text-sm text-gray-500">Owner Name</p>
                  <p className="font-medium">{vehicle.ownerName || 'Not available'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{vehicle.ownerLocation || 'Not available'}</p>
                </div>
                <div className="text-xs text-gray-400 italic">
                  Owner information will be fetched from RTO API in the future
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Carbon Footprint</h3>
              
              <div className="border p-4 rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold">
                    {vehicle.carbonFootprint?.carbonEmitted?.toFixed(2) || '0'} kg
                  </span>
                  {getStatusBadge(vehicle.carbonFootprint?.status)}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Distance Travelled</p>
                    <p className="font-medium">{vehicle.carbonFootprint?.distanceTravelled || '0'} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fuel Efficiency</p>
                    <p className="font-medium">{vehicle.carbonFootprint?.fuelEfficiency || '0'} km/L</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Checked</p>
                    <p className="font-medium">
                      {vehicle.lastChecked ? new Date(vehicle.lastChecked).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-6">Registration Details</h3>
              <div className="border p-4 rounded-md bg-gray-50 space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Issued At</p>
                  <p className="font-medium">{vehicle.issuedAt || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Issue Date</p>
                  <p className="font-medium">{vehicle.issueDate || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valid From</p>
                  <p className="font-medium">{vehicle.validFromDate || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expiry Date</p>
                  <p className="font-medium">{vehicle.expiryDate || 'N/A'}</p>
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
