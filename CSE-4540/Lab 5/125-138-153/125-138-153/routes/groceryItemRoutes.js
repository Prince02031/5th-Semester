const express = require('express');
const router = express.Router();
const groceryItemController = require('../controllers/groceryItemController');

// Create a new grocery item
router.post('/', groceryItemController.createGroceryItem);

// Get all grocery items
router.get('/', groceryItemController.getAllGroceryItems);

// Get expiring items
router.get('/expiring', groceryItemController.getExpiringItems);

// Get grocery item by ID
router.get('/:id', groceryItemController.getGroceryItemById);

// Update grocery item
router.put('/:id', groceryItemController.updateGroceryItem);

// Delete grocery item
router.delete('/:id', groceryItemController.deleteGroceryItem);

module.exports = router;
