const mongoose = require('mongoose');

const nutritionInfoSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true,
    unique: true
  },
  caloriesPerUnit: {
    type: Number,
    required: [true, 'Calories per unit is required'],
    min: [0, 'Calories must be positive']
  },
  protein: {
    type: Number,
    required: [true, 'Protein content is required'],
    min: [0, 'Protein must be positive']
  },
  carbs: {
    type: Number,
    required: [true, 'Carbohydrates content is required'],
    min: [0, 'Carbs must be positive']
  },
  fat: {
    type: Number,
    required: [true, 'Fat content is required'],
    min: [0, 'Fat must be positive']
  },
  restrictedFor: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('NutritionInfo', nutritionInfoSchema);
