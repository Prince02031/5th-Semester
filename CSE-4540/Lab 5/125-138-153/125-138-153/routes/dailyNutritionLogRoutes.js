const express = require('express');
const router = express.Router();
const dailyNutritionLogController = require('../controllers/dailyNutritionLogController');

// Create a new daily nutrition log
router.post('/', dailyNutritionLogController.createDailyNutritionLog);

// Get all daily nutrition logs
router.get('/', dailyNutritionLogController.getAllDailyNutritionLogs);

// Get daily nutrition logs by user
router.get('/user/:userId', dailyNutritionLogController.getDailyNutritionLogsByUser);

// Get daily nutrition log by ID
router.get('/:id', dailyNutritionLogController.getDailyNutritionLogById);

// Update daily nutrition log
router.put('/:id', dailyNutritionLogController.updateDailyNutritionLog);

// Delete daily nutrition log
router.delete('/:id', dailyNutritionLogController.deleteDailyNutritionLog);

module.exports = router;
