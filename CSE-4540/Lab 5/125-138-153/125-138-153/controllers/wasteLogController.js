const WasteLog = require('../models/wasteLogModel');
const GroceryItem = require('../models/groceryItemModel');

// Create a new waste log
exports.createWasteLog = async (req, res) => {
  try {
    const wasteLog = await WasteLog.create(req.body);
    
    // Update grocery item status to 'Wasted'
    await GroceryItem.findByIdAndUpdate(req.body.groceryItem, {
      status: 'Wasted'
    });
    
    res.status(201).json({
      success: true,
      message: 'Waste log created successfully',
      data: wasteLog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating waste log',
      error: error.message
    });
  }
};

// Get all waste logs
exports.getAllWasteLogs = async (req, res) => {
  try {
    const wasteLogs = await WasteLog.find().populate('groceryItem');
    res.status(200).json({
      success: true,
      count: wasteLogs.length,
      data: wasteLogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching waste logs',
      error: error.message
    });
  }
};

// Get waste log by ID
exports.getWasteLogById = async (req, res) => {
  try {
    const wasteLog = await WasteLog.findById(req.params.id).populate('groceryItem');
    if (!wasteLog) {
      return res.status(404).json({
        success: false,
        message: 'Waste log not found'
      });
    }
    res.status(200).json({
      success: true,
      data: wasteLog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching waste log',
      error: error.message
    });
  }
};

// Update waste log
exports.updateWasteLog = async (req, res) => {
  try {
    const wasteLog = await WasteLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('groceryItem');
    if (!wasteLog) {
      return res.status(404).json({
        success: false,
        message: 'Waste log not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Waste log updated successfully',
      data: wasteLog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating waste log',
      error: error.message
    });
  }
};

// Delete waste log
exports.deleteWasteLog = async (req, res) => {
  try {
    const wasteLog = await WasteLog.findByIdAndDelete(req.params.id);
    if (!wasteLog) {
      return res.status(404).json({
        success: false,
        message: 'Waste log not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Waste log deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting waste log',
      error: error.message
    });
  }
};

// Get waste analytics
exports.getWasteAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const wasteLogs = await WasteLog.find(query).populate('groceryItem');
    
    // Calculate analytics
    const totalWaste = wasteLogs.reduce((sum, log) => sum + log.wastedQuantity, 0);
    const wasteByReason = {};
    const wasteByCategory = {};
    
    wasteLogs.forEach(log => {
      // Waste by reason
      wasteByReason[log.reason] = (wasteByReason[log.reason] || 0) + log.wastedQuantity;
      
      // Waste by category
      if (log.groceryItem) {
        const category = log.groceryItem.category;
        wasteByCategory[category] = (wasteByCategory[category] || 0) + log.wastedQuantity;
      }
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalWaste,
        totalWasteRecords: wasteLogs.length,
        wasteByReason,
        wasteByCategory,
        wasteLogs
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching waste analytics',
      error: error.message
    });
  }
};
