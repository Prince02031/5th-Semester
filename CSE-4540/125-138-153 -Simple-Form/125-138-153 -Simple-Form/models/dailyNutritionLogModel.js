const mongoose = require('mongoose');

const dailyNutritionLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  totalCaloriesPlanned: {
    type: Number,
    default: 0,
    min: [0, 'Total calories planned must be positive']
  },
  meals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal'
  }],
  metCalorieTarget: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DailyNutritionLog', dailyNutritionLogSchema);
