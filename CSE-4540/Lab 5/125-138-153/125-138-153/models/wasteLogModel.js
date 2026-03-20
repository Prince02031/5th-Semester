const mongoose = require('mongoose');

const wasteLogSchema = new mongoose.Schema({
  groceryItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroceryItem',
    required: [true, 'Grocery item reference is required']
  },
  wastedQuantity: {
    type: Number,
    required: [true, 'Wasted quantity is required'],
    min: [0, 'Wasted quantity must be positive']
  },
  reason: {
    type: String,
    required: [true, 'Reason for waste is required'],
    enum: ['Expired', 'Spoiled', 'Over-purchased', 'Forgot to use', 'Cooked too much', 'Other'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WasteLog', wasteLogSchema);
