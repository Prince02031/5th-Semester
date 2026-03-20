const NutritionInfo = require('../models/nutritionInfoModel');

// Create a new nutrition info
exports.createNutritionInfo = async (req, res) => {
  try {
    const nutritionInfo = await NutritionInfo.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Nutrition info created successfully',
      data: nutritionInfo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating nutrition info',
      error: error.message
    });
  }
};

// Get all nutrition info
exports.getAllNutritionInfo = async (req, res) => {
  try {
    const nutritionInfo = await NutritionInfo.find();
    res.status(200).json({
      success: true,
      count: nutritionInfo.length,
      data: nutritionInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching nutrition info',
      error: error.message
    });
  }
};

// Get nutrition info by ID
exports.getNutritionInfoById = async (req, res) => {
  try {
    const nutritionInfo = await NutritionInfo.findById(req.params.id);
    if (!nutritionInfo) {
      return res.status(404).json({
        success: false,
        message: 'Nutrition info not found'
      });
    }
    res.status(200).json({
      success: true,
      data: nutritionInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching nutrition info',
      error: error.message
    });
  }
};

// Update nutrition info
exports.updateNutritionInfo = async (req, res) => {
  try {
    const nutritionInfo = await NutritionInfo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!nutritionInfo) {
      return res.status(404).json({
        success: false,
        message: 'Nutrition info not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Nutrition info updated successfully',
      data: nutritionInfo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating nutrition info',
      error: error.message
    });
  }
};

// Delete nutrition info
exports.deleteNutritionInfo = async (req, res) => {
  try {
    const nutritionInfo = await NutritionInfo.findByIdAndDelete(req.params.id);
    if (!nutritionInfo) {
      return res.status(404).json({
        success: false,
        message: 'Nutrition info not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Nutrition info deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting nutrition info',
      error: error.message
    });
  }
};
