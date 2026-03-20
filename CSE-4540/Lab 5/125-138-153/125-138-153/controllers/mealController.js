const Meal = require('../models/mealModel');
const GroceryItem = require('../models/groceryItemModel');

// Create a new meal
exports.createMeal = async (req, res) => {
  try {
    const meal = await Meal.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Meal created successfully',
      data: meal
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating meal',
      error: error.message
    });
  }
};

// Get all meals
exports.getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find().populate('ingredients');
    res.status(200).json({
      success: true,
      count: meals.length,
      data: meals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching meals',
      error: error.message
    });
  }
};

// Get meal by ID
exports.getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id).populate('ingredients');
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }
    res.status(200).json({
      success: true,
      data: meal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching meal',
      error: error.message
    });
  }
};

// Update meal
exports.updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('ingredients');
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Meal updated successfully',
      data: meal
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating meal',
      error: error.message
    });
  }
};

// Delete meal
exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Meal deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting meal',
      error: error.message
    });
  }
};

// Get meals by date range
exports.getMealsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const meals = await Meal.find({
      plannedDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('ingredients');
    
    res.status(200).json({
      success: true,
      count: meals.length,
      data: meals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching meals',
      error: error.message
    });
  }
};
