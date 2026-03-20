const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.json({
    message: 'Food Waste Management & Meal Planning API',
    version: '1.0.0'
  });
});

// data routes
const userRoutes = require('./routes/userRoutes');
const groceryItemRoutes = require('./routes/groceryItemRoutes');
const nutritionInfoRoutes = require('./routes/nutritionInfoRoutes');
const mealRoutes = require('./routes/mealRoutes');
const wasteLogRoutes = require('./routes/wasteLogRoutes');
const dailyNutritionLogRoutes = require('./routes/dailyNutritionLogRoutes');

// api routes
app.use('/api/users', userRoutes);
app.use('/api/grocery-items', groceryItemRoutes);
app.use('/api/nutrition-info', nutritionInfoRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/waste-logs', wasteLogRoutes);
app.use('/api/daily-nutrition-logs', dailyNutritionLogRoutes);


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
