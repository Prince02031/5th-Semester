const Meal = require('../models/mealModel');
const GroceryItem = require('../models/groceryItemModel');
const NutritionInfo = require('../models/nutritionInfoModel');
const User = require('../models/userModel');
const DailyNutritionLog = require('../models/dailyNutritionLogModel');

const MEAL_SHARES = {
  Breakfast: 0.25,
  Lunch: 0.35,
  Dinner: 0.30,
  Snack: 0.10
};

function calculateDailyCalories(user) {
  const bmr = (10 * user.weight) + (6.25 * user.height) - (5 * user.age) - 161;
  return bmr * 1.55;
}

//feature 2.2
function selectIngredients(candidates, targetCalories) {
  const selected = [];
  let accumulated = 0;
  const lower = targetCalories * 0.90;
  const upper = targetCalories * 1.10;

  // Group candidates by category (used in generating meal plan)
  const buckets = {};
  for (const candidate of candidates) {
    const cat = candidate.item.category;
    if (!buckets[cat]) buckets[cat] = [];
    buckets[cat].push(candidate);
  }

  let categoryKeys = Object.keys(buckets);

  while (accumulated < lower && categoryKeys.length > 0) {
    const exhausted = [];

    for (const cat of categoryKeys) {
      if (accumulated >= lower) break;

      //check item within upper bound
      const bucket = buckets[cat];
      let picked = false;
      while (bucket.length > 0) {
        const candidate = bucket.shift();
        const itemCalories = candidate.nutrition.caloriesPerUnit * candidate.item.quantity;
        if (accumulated + itemCalories <= upper) {
          selected.push({ item: candidate.item, nutrition: candidate.nutrition, calories: itemCalories });
          accumulated += itemCalories;
          picked = true;
          break;
        }
      }

      if (!picked && bucket.length === 0) exhausted.push(cat);
    }
    categoryKeys = categoryKeys.filter(k => !exhausted.includes(k) && buckets[k].length > 0);
  }

  return { selected, totalCalories: accumulated };
}

const getAllMeals = async (req, res) => {
  const meals = await Meal.find().populate('ingredients').sort({createdAt: -1});
  res.status(200).json(meals);
};

const getMealById = async (req, res) => {
  const { id } = req.params;
  const meal = await Meal.findById(id).populate('ingredients');

  if (!meal) {
    return res.status(404).json({error: 'No such meal'});
  }

  res.status(200).json(meal);
};

const createMeal = async (req, res) => {
  try {
    const meal = await Meal.create(req.body);
    res.status(200).json(meal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMeal = async (req, res) => {
  const { id } = req.params;
  const meal = await Meal.findOneAndDelete({_id: id});

  if(!meal) {
    return res.status(400).json({error: 'No such meal'});
  }

  res.status(200).json(meal);
};

const updateMeal = async (req, res) => {
  const { id } = req.params;
  const meal = await Meal.findOneAndUpdate({_id: id}, {
    ...req.body
  }, {new: true}).populate('ingredients');

  if (!meal) {
    return res.status(400).json({error: 'No such meal'});
  }

  res.status(200).json(meal);
};

const getMealsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const meals = await Meal.find({
      plannedDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('ingredients');
    
    res.status(200).json(meals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//feature 2.2
const generateMealPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const dailyCalories = calculateDailyCalories(user);

    const groceries = await GroceryItem.find({
      status: 'available',
      expiryDate: { $gt: new Date() },
      quantity: { $gt: 0 }
    }).sort({ expiryDate: 1 }); 

    const allNutrition = await NutritionInfo.find();
    const nutritionMap = {};
    allNutrition.forEach(n => {
      nutritionMap[n.foodName.toLowerCase()] = n;
    });

    // Filter out items
    const restrictions = (user.dietaryRestrictions || []).map(r => r.toLowerCase());
    const preferences = (user.dietaryPreferences || []).map(p => p.toLowerCase());

    const eligible = groceries
      .map(item => {
        const nutrition = nutritionMap[item.name.toLowerCase()];
        if (!nutrition) return null;

        // Exclude if restricted
        const itemRestrictions = (nutrition.restrictedFor || []).map(r => r.toLowerCase());
        const blocked = itemRestrictions.some(r => restrictions.includes(r) || preferences.includes(r));
        if (blocked) return null;

        return { item, nutrition };
      })
      .filter(Boolean)
      
      .sort((a, b) => {//sort by close expiry, then calorie
        const expiryDiff = new Date(a.item.expiryDate) - new Date(b.item.expiryDate);
        if (expiryDiff !== 0) return expiryDiff;
        return (b.nutrition.caloriesPerUnit) - (a.nutrition.caloriesPerUnit);
      });

    if (eligible.length === 0) {
      return res.status(400).json({ error: 'No eligible grocery items found for meal planning' });
    }

    //one meal per type
    const mealTypes = Object.keys(MEAL_SHARES);
    const savedMeals = [];
    const allSelected = [];

    for (const mealType of mealTypes) {
      const target = dailyCalories * MEAL_SHARES[mealType];
      const { selected, totalCalories } = selectIngredients(eligible, target);

      const meal = await Meal.create({
        name: `${mealType} - ${today.toDateString()}`,
        ingredients: selected.map(s => s.item._id),
        mealType,
        plannedDate: today,
        totalCalories: Math.round(totalCalories),
        cooked: false
      });

      savedMeals.push(meal);
      allSelected.push(...selected);
    }

    //post processing
    const usedIds = [...new Set(allSelected.map(s => s.item._id.toString()))];
    const bulkOps = usedIds.map(id => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { quantity: 0, status: 'consumed' }, $inc: { consumptionCount: 1 } }
      }
    }));
    if (bulkOps.length > 0) await GroceryItem.bulkWrite(bulkOps);

    // Save DailyNutritionLog
    const totalCaloriesPlanned = savedMeals.reduce((sum, m) => sum + m.totalCalories, 0);
    const metTarget = Math.abs(totalCaloriesPlanned - dailyCalories) / dailyCalories <= 0.10;

    const dailyLog = await DailyNutritionLog.create({
      user: userId,
      date: today,
      totalCaloriesPlanned,
      meals: savedMeals.map(m => m._id),
      metCalorieTarget: metTarget
    });

    res.status(200).json({
      dailyCaloriesTarget: Math.round(dailyCalories),
      totalCaloriesPlanned,
      metCalorieTarget: metTarget,
      meals: savedMeals,
      dailyNutritionLog: dailyLog
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  getAllMeals,
  getMealById,
  createMeal,
  deleteMeal,
  updateMeal,
  getMealsByDateRange,
  generateMealPlan
};
