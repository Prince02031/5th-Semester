const express = require('express');
const router = express.Router();
const {
  getAllGroceryItems,
  getGroceryItemById,
  createGroceryItem,
  deleteGroceryItem,
  updateGroceryItem,
  getExpiringItems,
  processForgottenItems,
  processDonationSuggestions
} = require('../controllers/groceryItemController');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllGroceryItems);

router.get('/expiring', getExpiringItems);

router.post('/process-forgotten', processForgottenItems);

router.post('/process-donations', processDonationSuggestions);

router.get('/:id', getGroceryItemById);

router.post('/', upload.array('images', 5), createGroceryItem);

router.delete('/:id', deleteGroceryItem);

router.patch('/:id', upload.array('images', 5), updateGroceryItem);

module.exports = router;
