const GroceryItem = require('../models/groceryItemModel');
const WasteLog = require('../models/wasteLogModel');


const getAllGroceryItems = async (req, res) => {
  const groceryItems = await GroceryItem.find().sort({createdAt: -1});
  res.status(200).json(groceryItems);
};


const getGroceryItemById = async (req, res) => {
  const { id } = req.params;
  const groceryItem = await GroceryItem.findById(id);

  if (!groceryItem) {
    return res.status(404).json({error: 'No such grocery item'});
  }

  res.status(200).json(groceryItem);
};


const createGroceryItem = async (req, res) => {
  try {
    const itemData = { ...req.body };
    if (req.files && req.files.length > 0) {
      itemData.images = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        publicId: file.filename
      }));
    }
    const groceryItem = await GroceryItem.create(itemData);
    res.status(200).json(groceryItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const deleteGroceryItem = async (req, res) => {
  const { id } = req.params;
  const groceryItem = await GroceryItem.findOneAndDelete({_id: id});

  if(!groceryItem) {
    return res.status(400).json({error: 'No such grocery item'});
  }

  res.status(200).json(groceryItem);
};


const updateGroceryItem = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  if (req.files && req.files.length > 0) {
    updateData.images = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      publicId: file.filename
    }));
  }
  const groceryItem = await GroceryItem.findOneAndUpdate({_id: id}, updateData, {new: true});

  if (!groceryItem) {
    return res.status(400).json({error: 'No such grocery item'});
  }

  res.status(200).json(groceryItem);
};


const getExpiringItems = async (req, res) => { //only for items expiring in 7 days
  try {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const expiringItems = await GroceryItem.find({
      expiryDate: { $lte: sevenDaysFromNow, $gte: new Date() },
      status: { $in: ['available'] }
    });
    
    res.status(200).json(expiringItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//feature 1a
const processForgottenItems = async (req, res) => {
  try {
    const now = new Date();

    const forgottenItems = await GroceryItem.find({
      expiryDate: { $lt: now },
      consumptionCount: 0,
      status: { $nin: ['expired', 'donated', 'consumed'] }
    });

    if (forgottenItems.length === 0) {
      return res.status(200).json({ message: 'No forgotten items found', processed: 0 });
    }

    const wasteLogs = forgottenItems.map(item => ({
      groceryItem: item._id,
      wastedQuantity: item.quantity,
      reason: 'forgotten',
      date: now
    }));

    await WasteLog.insertMany(wasteLogs);

    const ids = forgottenItems.map(item => item._id);
    await GroceryItem.updateMany({ _id: { $in: ids } }, { status: 'expired' });

    res.status(200).json({
      message: 'Forgotten items processed',
      processed: forgottenItems.length,
      items: forgottenItems.map(i => ({ id: i._id, name: i.name, expiryDate: i.expiryDate }))
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


//feature 1b
const processDonationSuggestions = async (req, res) => {
  try {
    const now = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(now.getDate() + 2);

    const donationCandidates = await GroceryItem.find({
      expiryDate: { $gte: now, $lte: twoDaysFromNow },
      storageType: { $ne: 'freezer' },
      status: 'available'
    });

    if (donationCandidates.length === 0) {
      return res.status(200).json({ message: 'No donation candidates found', processed: 0 });
    }

    const ids = donationCandidates.map(item => item._id);
    await GroceryItem.updateMany({ _id: { $in: ids } }, { status: 'donated' });

    res.status(200).json({
      message: 'Donation suggestions processed',
      processed: donationCandidates.length,
      items: donationCandidates.map(i => ({ id: i._id, name: i.name, expiryDate: i.expiryDate, storageType: i.storageType }))
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  getAllGroceryItems,
  getGroceryItemById,
  createGroceryItem,
  deleteGroceryItem,
  updateGroceryItem,
  getExpiringItems,
  processForgottenItems,
  processDonationSuggestions
};
