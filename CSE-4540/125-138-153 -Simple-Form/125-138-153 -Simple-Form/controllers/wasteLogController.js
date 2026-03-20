const WasteLog = require('../models/wasteLogModel');
const GroceryItem = require('../models/groceryItemModel');

const getAllWasteLogs = async (req, res) => {
  const wasteLogs = await WasteLog.find().populate('groceryItem').sort({createdAt: -1});
  res.status(200).json(wasteLogs);
};

const getWasteLogById = async (req, res) => {
  const { id } = req.params;
  const wasteLog = await WasteLog.findById(id).populate('groceryItem');

  if (!wasteLog) {
    return res.status(404).json({error: 'No such waste log'});
  }

  res.status(200).json(wasteLog);
};

const createWasteLog = async (req, res) => {
  try {
    const wasteLog = await WasteLog.create(req.body);
    
    await GroceryItem.findByIdAndUpdate(req.body.groceryItem, {
      status: 'Wasted'
    });
    
    res.status(200).json(wasteLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteWasteLog = async (req, res) => {
  const { id } = req.params;
  const wasteLog = await WasteLog.findOneAndDelete({_id: id});

  if(!wasteLog) {
    return res.status(400).json({error: 'No such waste log'});
  }

  res.status(200).json(wasteLog);
};

const updateWasteLog = async (req, res) => {
  const { id } = req.params;
  const wasteLog = await WasteLog.findOneAndUpdate({_id: id}, {
    ...req.body
  }, {new: true}).populate('groceryItem');

  if (!wasteLog) {
    return res.status(400).json({error: 'No such waste log'});
  }

  res.status(200).json(wasteLog);
};

const getWasteAnalytics = async (req, res) => {
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
    
    //calculation
    const totalWaste = wasteLogs.reduce((sum, log) => sum + log.wastedQuantity, 0);
    const wasteByReason = {};
    const wasteByCategory = {};
    
    wasteLogs.forEach(log => {
      wasteByReason[log.reason] = (wasteByReason[log.reason] || 0) + log.wastedQuantity;
      
      if (log.groceryItem) {
        const category = log.groceryItem.category;
        wasteByCategory[category] = (wasteByCategory[category] || 0) + log.wastedQuantity;
      }
    });
    
    res.status(200).json({
      totalWaste,
      totalWasteRecords: wasteLogs.length,
      wasteByReason,
      wasteByCategory,
      wasteLogs
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllWasteLogs,
  getWasteLogById,
  createWasteLog,
  deleteWasteLog,
  updateWasteLog,
  getWasteAnalytics
};
