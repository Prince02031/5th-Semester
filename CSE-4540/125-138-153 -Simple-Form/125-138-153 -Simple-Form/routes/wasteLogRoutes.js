const express = require('express');
const router = express.Router();
const {
  getAllWasteLogs,
  getWasteLogById,
  createWasteLog,
  deleteWasteLog,
  updateWasteLog,
  getWasteAnalytics
} = require('../controllers/wasteLogController');


router.get('/', getAllWasteLogs);

router.get('/analytics', getWasteAnalytics);

router.get('/:id', getWasteLogById);

router.post('/', createWasteLog);

router.delete('/:id', deleteWasteLog);

router.patch('/:id', updateWasteLog);

module.exports = router;
