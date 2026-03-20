const express = require('express');
const router = express.Router();
const {
  getAllDailyNutritionLogs,
  getDailyNutritionLogById,
  createDailyNutritionLog,
  deleteDailyNutritionLog,
  updateDailyNutritionLog,
  getDailyNutritionLogsByUser
} = require('../controllers/dailyNutritionLogController');

router.get('/', getAllDailyNutritionLogs);

router.get('/user/:userId', getDailyNutritionLogsByUser);

router.get('/:id', getDailyNutritionLogById);

router.post('/', createDailyNutritionLog);

router.delete('/:id', deleteDailyNutritionLog);

router.patch('/:id', updateDailyNutritionLog);

module.exports = router;
