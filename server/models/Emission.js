const mongoose = require('mongoose');

const EmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  source: {
    type: String,
    required: [true, 'Please provide an emission source'],
    enum: ['transportation', 'electricity', 'heating', 'food', 'other'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an emission amount'],
    min: [0, 'Amount must be a positive number'],
  },
  unit: {
    type: String,
    required: [true, 'Please provide a unit of measurement'],
    enum: ['kg', 'ton'],
    default: 'kg',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    trim: true,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create index for faster queries
EmissionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Emission', EmissionSchema);
