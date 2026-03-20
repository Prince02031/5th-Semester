const express = require('express');
const router = express.Router();
const wasteLogController = require('../controllers/wasteLogController');

// Create a new waste log
router.post('/', wasteLogController.createWasteLog);

// Get all waste logs
router.get('/', wasteLogController.getAllWasteLogs);

// Get waste analytics
router.get('/analytics', wasteLogController.getWasteAnalytics);

// Get waste log by ID
router.get('/:id', wasteLogController.getWasteLogById);

// Update waste log
router.put('/:id', wasteLogController.updateWasteLog);

// Delete waste log
router.delete('/:id', wasteLogController.deleteWasteLog);

module.exports = router;
