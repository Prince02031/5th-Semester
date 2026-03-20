const NutritionInfo = require('../models/nutritionInfoModel');

const getAllNutritionInfo = async (req, res) => {
  const nutritionInfo = await NutritionInfo.find().sort({createdAt: -1});
  res.status(200).json(nutritionInfo);
};

const getNutritionInfoById = async (req, res) => {
  const { id } = req.params;
  const nutritionInfo = await NutritionInfo.findById(id);

  if (!nutritionInfo) {
    return res.status(404).json({error: 'No such nutrition info'});
  }

  res.status(200).json(nutritionInfo);
};

const createNutritionInfo = async (req, res) => {
  try {
    const nutritionInfo = await NutritionInfo.create(req.body);
    res.status(200).json(nutritionInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteNutritionInfo = async (req, res) => {
  const { id } = req.params;
  const nutritionInfo = await NutritionInfo.findOneAndDelete({_id: id});

  if(!nutritionInfo) {
    return res.status(400).json({error: 'No such nutrition info'});
  }

  res.status(200).json(nutritionInfo);
};

const updateNutritionInfo = async (req, res) => {
  const { id } = req.params;
  const nutritionInfo = await NutritionInfo.findOneAndUpdate({_id: id}, {
    ...req.body
  }, {new: true});

  if (!nutritionInfo) {
    return res.status(400).json({error: 'No such nutrition info'});
  }

  res.status(200).json(nutritionInfo);
};

module.exports = {
  getAllNutritionInfo,
  getNutritionInfoById,
  createNutritionInfo,
  deleteNutritionInfo,
  updateNutritionInfo
};
