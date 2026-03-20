const express = require('express');
const router = express.Router();
const nutritionInfoController = require('../controllers/nutritionInfoController');

// Create a new nutrition info
router.post('/', nutritionInfoController.createNutritionInfo);

// Get all nutrition info
router.get('/', nutritionInfoController.getAllNutritionInfo);

// Get nutrition info by ID
router.get('/:id', nutritionInfoController.getNutritionInfoById);

// Update nutrition info
router.put('/:id', nutritionInfoController.updateNutritionInfo);

// Delete nutrition info
router.delete('/:id', nutritionInfoController.deleteNutritionInfo);

module.exports = router;
