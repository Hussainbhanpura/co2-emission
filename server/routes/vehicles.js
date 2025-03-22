const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getExceedingVehicles,
  getVehicleStats,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');

// Stats route
router.get('/stats', getVehicleStats);

// Exceeding vehicles route
router.get('/exceeding', getExceedingVehicles);

// Main routes
router.route('/')
  .get(getVehicles)
  .post(createVehicle);

router.route('/:id')
  .put(updateVehicle)
  .delete(deleteVehicle);

module.exports = router;
