const DailyNutritionLog = require('../models/dailyNutritionLogModel');
const Meal = require('../models/mealModel');


const getAllDailyNutritionLogs = async (req, res) => {
  const dailyLogs = await DailyNutritionLog.find()
    .populate('user')
    .populate('meals')
    .sort({createdAt: -1});
  res.status(200).json(dailyLogs);
};

const getDailyNutritionLogById = async (req, res) => {
  const { id } = req.params;
  const dailyLog = await DailyNutritionLog.findById(id)
    .populate('user')
    .populate('meals');

  if (!dailyLog) {
    return res.status(404).json({error: 'No such daily nutrition log'});
  }

  res.status(200).json(dailyLog);
};


const createDailyNutritionLog = async (req, res) => {
  try {
    const dailyLog = await DailyNutritionLog.create(req.body);
    res.status(200).json(dailyLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const deleteDailyNutritionLog = async (req, res) => {
  const { id } = req.params;
  const dailyLog = await DailyNutritionLog.findOneAndDelete({_id: id});

  if(!dailyLog) {
    return res.status(400).json({error: 'No such daily nutrition log'});
  }

  res.status(200).json(dailyLog);
};


const updateDailyNutritionLog = async (req, res) => {
  const { id } = req.params;
  const dailyLog = await DailyNutritionLog.findOneAndUpdate({_id: id}, {
    ...req.body
  }, {new: true}).populate('user').populate('meals');

  if (!dailyLog) {
    return res.status(400).json({error: 'No such daily nutrition log'});
  }

  res.status(200).json(dailyLog);
};


const getDailyNutritionLogsByUser = async (req, res) => {
  try {
    const dailyLogs = await DailyNutritionLog.find({ user: req.params.userId })
      .populate('user')
      .populate('meals')
      .sort({ date: -1 });
    res.status(200).json(dailyLogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllDailyNutritionLogs,
  getDailyNutritionLogById,
  createDailyNutritionLog,
  deleteDailyNutritionLog,
  updateDailyNutritionLog,
  getDailyNutritionLogsByUser
};
