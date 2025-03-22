const express = require('express');
const router = express.Router();
const {
  getEmissions,
  getEmission,
  createEmission,
  updateEmission,
  deleteEmission,
  getEmissionStats,
} = require('../controllers/emissionController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Stats route
router.get('/stats', getEmissionStats);

// Main routes
router.route('/')
  .get(getEmissions)
  .post(createEmission);

router.route('/:id')
  .get(getEmission)
  .put(updateEmission)
  .delete(deleteEmission);

module.exports = router;
