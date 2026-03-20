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
    enum: ['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Grains', 'Beverages', 'Snacks', 'Other'],
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
    enum: ['kg', 'g', 'lbs', 'oz', 'liters', 'ml', 'pieces', 'dozen'],
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
    enum: ['Refrigerator', 'Freezer', 'Pantry', 'Counter'],
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
    enum: ['Available', 'Partially Used', 'Consumed', 'Wasted', 'Expired'],
    default: 'Available'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GroceryItem', groceryItemSchema);
