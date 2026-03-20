const mongoose = require('mongoose');

const groceryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Grocery item name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['vegetable', 'fruit', 'dairy', 'meat', 'grain', 'snack'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity must be positive']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['g', 'kg', 'pcs', 'litre'],
    trim: true
  },
  purchaseDate: {
    type: Date,
    required: [true, 'Purchase date is required']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  storageType: {
    type: String,
    required: [true, 'Storage type is required'],
    enum: ['fridge', 'freezer', 'pantry'],
    trim: true
  },
  images: [{
    url: {
      type: String,
      default: ''
    },
    publicId: {
      type: String,
      default: ''
    }
  }],
  consumptionCount: {
    type: Number,
    default: 0,
    min: [0, 'Consumption count cannot be negative']
  },
  status: {
    type: String,
    enum: ['available', 'consumed', 'expired', 'donated'],
    default: 'available'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GroceryItem', groceryItemSchema);
