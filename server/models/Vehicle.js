const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  number: {
    type: String,
    required: [true, 'Please provide a vehicle number'],
    trim: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a vehicle name'],
    trim: true
  },
  fuelType: {
    type: String,
    required: [true, 'Please provide a fuel type'],
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'],
    trim: true
  },
  ownerName: {
    type: String,
    default: '',
    trim: true
  },
  ownerLocation: {
    type: String,
    default: '',
    trim: true
  },
  carbonFootprint: {
    distanceTravelled: {
      type: Number,
      default: 0,
      min: [0, 'Distance must be a positive number']
    },
    fuelEfficiency: {
      type: Number,
      default: 0,
      min: [0, 'Fuel efficiency must be a positive number']
    },
    carbonEmitted: {
      type: Number,
      default: 0,
      min: [0, 'Carbon emitted must be a positive number']
    },
    status: {
      type: String,
      default: '✅ Good'
    }
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for faster queries
VehicleSchema.index({ number: 1 });
VehicleSchema.index({ 'carbonFootprint.carbonEmitted': 1 });

// Pre-save middleware to update the status based on carbonEmitted
VehicleSchema.pre('save', function(next) {
  // Update the status based on carbonEmitted
  if (this.carbonFootprint.carbonEmitted > 15) {
    this.carbonFootprint.status = '❌ Exceeding Limit';
  } else if (this.carbonFootprint.carbonEmitted > 10) {
    this.carbonFootprint.status = '⚠️ Warning';
  } else {
    this.carbonFootprint.status = '✅ Good';
  }
  
  // Update the updatedAt timestamp
  this.updatedAt = Date.now();
  
  next();
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
