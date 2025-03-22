const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Public
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ 'carbonFootprint.carbonEmitted': -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get vehicles exceeding CO2 emission threshold
// @route   GET /api/vehicles/exceeding
// @access  Public
exports.getExceedingVehicles = async (req, res) => {
  try {
    const threshold = 15; // CO2 emission threshold in kg
    
    const vehicles = await Vehicle.find({
      'carbonFootprint.carbonEmitted': { $gt: threshold }
    }).sort({ 'carbonFootprint.carbonEmitted': -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      threshold: threshold,
      data: vehicles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get vehicle statistics
// @route   GET /api/vehicles/stats
// @access  Public
exports.getVehicleStats = async (req, res) => {
  try {
    const stats = await Vehicle.aggregate([
      {
        $group: {
          _id: '$fuelType',
          totalVehicles: { $sum: 1 },
          avgCarbonEmitted: { $avg: '$carbonFootprint.carbonEmitted' },
          totalCarbonEmitted: { $sum: '$carbonFootprint.carbonEmitted' },
        },
      },
      { $sort: { totalCarbonEmitted: -1 } },
    ]);

    // Get count of vehicles exceeding threshold
    const exceedingCount = await Vehicle.countDocuments({
      'carbonFootprint.carbonEmitted': { $gt: 15 }
    });

    // Get total vehicles
    const totalVehicles = await Vehicle.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        fuelTypeStats: stats,
        exceedingCount,
        totalVehicles,
        exceedingPercentage: totalVehicles > 0 ? (exceedingCount / totalVehicles) * 100 : 0
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new vehicle
// @route   POST /api/vehicles
// @access  Public
exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);

    res.status(201).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Public
exports.updateVehicle = async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Public
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    await vehicle.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
