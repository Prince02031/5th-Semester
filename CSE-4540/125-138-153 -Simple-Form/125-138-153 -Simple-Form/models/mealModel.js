const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Meal name is required'],
    trim: true
  },
  ingredients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroceryItem'
  }],
  mealType: {
    type: String,
    required: [true, 'Meal type is required'],
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    trim: true
  },
  plannedDate: {
    type: Date,
    required: [true, 'Planned date is required']
  },
  totalCalories: {
    type: Number,
    default: 0,
    min: [0, 'Total calories must be positive']
  },
  cooked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Meal', mealSchema);
