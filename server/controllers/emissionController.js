const Emission = require('../models/Emission');

// @desc    Get all emissions for a user
// @route   GET /api/emissions
// @access  Private
exports.getEmissions = async (req, res) => {
  try {
    const emissions = await Emission.find({ user: req.user.id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: emissions.length,
      data: emissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single emission
// @route   GET /api/emissions/:id
// @access  Private
exports.getEmission = async (req, res) => {
  try {
    const emission = await Emission.findById(req.params.id);

    if (!emission) {
      return res.status(404).json({
        success: false,
        message: 'Emission not found',
      });
    }

    // Make sure user owns the emission
    if (emission.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this emission',
      });
    }

    res.status(200).json({
      success: true,
      data: emission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new emission
// @route   POST /api/emissions
// @access  Private
exports.createEmission = async (req, res) => {
  try {
    // Add user to request body
    req.body.user = req.user.id;

    const emission = await Emission.create(req.body);

    res.status(201).json({
      success: true,
      data: emission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update emission
// @route   PUT /api/emissions/:id
// @access  Private
exports.updateEmission = async (req, res) => {
  try {
    let emission = await Emission.findById(req.params.id);

    if (!emission) {
      return res.status(404).json({
        success: false,
        message: 'Emission not found',
      });
    }

    // Make sure user owns the emission
    if (emission.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this emission',
      });
    }

    emission = await Emission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: emission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete emission
// @route   DELETE /api/emissions/:id
// @access  Private
exports.deleteEmission = async (req, res) => {
  try {
    const emission = await Emission.findById(req.params.id);

    if (!emission) {
      return res.status(404).json({
        success: false,
        message: 'Emission not found',
      });
    }

    // Make sure user owns the emission
    if (emission.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this emission',
      });
    }

    await emission.deleteOne();

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

// @desc    Get emission statistics
// @route   GET /api/emissions/stats
// @access  Private
exports.getEmissionStats = async (req, res) => {
  try {
    const stats = await Emission.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$source',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
