const DailyNutritionLog = require('../models/dailyNutritionLogModel');
const Meal = require('../models/mealModel');

// Create a new daily nutrition log
exports.createDailyNutritionLog = async (req, res) => {
  try {
    const dailyLog = await DailyNutritionLog.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Daily nutrition log created successfully',
      data: dailyLog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating daily nutrition log',
      error: error.message
    });
  }
};

// Get all daily nutrition logs
exports.getAllDailyNutritionLogs = async (req, res) => {
  try {
    const dailyLogs = await DailyNutritionLog.find()
      .populate('user')
      .populate('meals');
    res.status(200).json({
      success: true,
      count: dailyLogs.length,
      data: dailyLogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching daily nutrition logs',
      error: error.message
    });
  }
};

// Get daily nutrition log by ID
exports.getDailyNutritionLogById = async (req, res) => {
  try {
    const dailyLog = await DailyNutritionLog.findById(req.params.id)
      .populate('user')
      .populate('meals');
    if (!dailyLog) {
      return res.status(404).json({
        success: false,
        message: 'Daily nutrition log not found'
      });
    }
    res.status(200).json({
      success: true,
      data: dailyLog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching daily nutrition log',
      error: error.message
    });
  }
};

// Update daily nutrition log
exports.updateDailyNutritionLog = async (req, res) => {
  try {
    const dailyLog = await DailyNutritionLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user').populate('meals');
    if (!dailyLog) {
      return res.status(404).json({
        success: false,
        message: 'Daily nutrition log not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Daily nutrition log updated successfully',
      data: dailyLog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating daily nutrition log',
      error: error.message
    });
  }
};

// Delete daily nutrition log
exports.deleteDailyNutritionLog = async (req, res) => {
  try {
    const dailyLog = await DailyNutritionLog.findByIdAndDelete(req.params.id);
    if (!dailyLog) {
      return res.status(404).json({
        success: false,
        message: 'Daily nutrition log not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Daily nutrition log deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting daily nutrition log',
      error: error.message
    });
  }
};

// Get daily nutrition logs by user
exports.getDailyNutritionLogsByUser = async (req, res) => {
  try {
    const dailyLogs = await DailyNutritionLog.find({ user: req.params.userId })
      .populate('user')
      .populate('meals')
      .sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: dailyLogs.length,
      data: dailyLogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching daily nutrition logs',
      error: error.message
    });
  }
};
