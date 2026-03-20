const express = require('express');
const router = express.Router();
const {
  getAllNutritionInfo,
  getNutritionInfoById,
  createNutritionInfo,
  deleteNutritionInfo,
  updateNutritionInfo
} = require('../controllers/nutritionInfoController');


router.get('/', getAllNutritionInfo);
router.get('/:id', getNutritionInfoById);
router.post('/', createNutritionInfo);
router.delete('/:id', deleteNutritionInfo);
router.patch('/:id', updateNutritionInfo);

module.exports = router;
