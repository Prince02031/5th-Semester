const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');

// Create a new meal
router.post('/', mealController.createMeal);

// Get all meals
router.get('/', mealController.getAllMeals);

// Get meals by date range
router.get('/date-range', mealController.getMealsByDateRange);

// Get meal by ID
router.get('/:id', mealController.getMealById);

// Update meal
router.put('/:id', mealController.updateMeal);

// Delete meal
router.delete('/:id', mealController.deleteMeal);

module.exports = router;
