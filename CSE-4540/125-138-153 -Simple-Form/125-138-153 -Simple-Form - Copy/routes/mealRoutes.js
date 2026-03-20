const express = require('express');
const router = express.Router();
const {
  getAllMeals,
  getMealById,
  createMeal,
  deleteMeal,
  updateMeal,
  getMealsByDateRange,
  generateMealPlan
} = require('../controllers/mealController');

router.get('/', getAllMeals);

router.get('/date-range', getMealsByDateRange);

router.post('/generate-plan/:userId', generateMealPlan);

router.get('/:id', getMealById);

router.post('/', createMeal);

router.delete('/:id', deleteMeal);

router.patch('/:id', updateMeal);

module.exports = router;
