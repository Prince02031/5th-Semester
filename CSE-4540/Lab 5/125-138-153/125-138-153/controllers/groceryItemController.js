const GroceryItem = require('../models/groceryItemModel');

// Create a new grocery item
exports.createGroceryItem = async (req, res) => {
  try {
    const groceryItem = await GroceryItem.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Grocery item created successfully',
      data: groceryItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating grocery item',
      error: error.message
    });
  }
};

// Get all grocery items
exports.getAllGroceryItems = async (req, res) => {
  try {
    const groceryItems = await GroceryItem.find();
    res.status(200).json({
      success: true,
      count: groceryItems.length,
      data: groceryItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching grocery items',
      error: error.message
    });
  }
};

// Get grocery item by ID
exports.getGroceryItemById = async (req, res) => {
  try {
    const groceryItem = await GroceryItem.findById(req.params.id);
    if (!groceryItem) {
      return res.status(404).json({
        success: false,
        message: 'Grocery item not found'
      });
    }
    res.status(200).json({
      success: true,
      data: groceryItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching grocery item',
      error: error.message
    });
  }
};

// Update grocery item
exports.updateGroceryItem = async (req, res) => {
  try {
    const groceryItem = await GroceryItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!groceryItem) {
      return res.status(404).json({
        success: false,
        message: 'Grocery item not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Grocery item updated successfully',
      data: groceryItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating grocery item',
      error: error.message
    });
  }
};

// Delete grocery item
exports.deleteGroceryItem = async (req, res) => {
  try {
    const groceryItem = await GroceryItem.findByIdAndDelete(req.params.id);
    if (!groceryItem) {
      return res.status(404).json({
        success: false,
        message: 'Grocery item not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Grocery item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting grocery item',
      error: error.message
    });
  }
};

// Get expiring items (items expiring within next 7 days)
exports.getExpiringItems = async (req, res) => {
  try {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const expiringItems = await GroceryItem.find({
      expiryDate: { $lte: sevenDaysFromNow, $gte: new Date() },
      status: { $in: ['Available', 'Partially Used'] }
    });
    
    res.status(200).json({
      success: true,
      count: expiringItems.length,
      data: expiringItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expiring items',
      error: error.message
    });
  }
};
