const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  householdSize: {
    type: Number,
    required: [true, 'Household size is required'],
    min: [1, 'Household size must be at least 1']
  },
  dietaryPreferences: [{
    type: String,
    trim: true
  }],
  dietaryRestrictions: [{
    type: String,
    trim: true
  }],
  height: {
    type: Number,
    required: [true, 'Height is required'],
    min: [0, 'Height must be positive']
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [0, 'Weight must be positive']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age must be positive']
  },
  profileImage: {
    url: {
      type: String,
      default: ''
    },
    publicId: {
      type: String,
      default: ''
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
