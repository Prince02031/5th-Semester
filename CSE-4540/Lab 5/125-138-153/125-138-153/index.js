const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// Import routes
const userRoutes = require('./routes/userRoutes');
const groceryItemRoutes = require('./routes/groceryItemRoutes');
const nutritionInfoRoutes = require('./routes/nutritionInfoRoutes');
const mealRoutes = require('./routes/mealRoutes');
const wasteLogRoutes = require('./routes/wasteLogRoutes');
const dailyNutritionLogRoutes = require('./routes/dailyNutritionLogRoutes');

// API routes
app.use('/api/users', userRoutes);
app.use('/api/grocery-items', groceryItemRoutes);
app.use('/api/nutrition-info', nutritionInfoRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/waste-logs', wasteLogRoutes);
app.use('/api/daily-nutrition-logs', dailyNutritionLogRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Food Waste Management & Meal Planning API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      groceryItems: '/api/grocery-items',
      nutritionInfo: '/api/nutrition-info',
      meals: '/api/meals',
      wasteLogs: '/api/waste-logs',
      dailyNutritionLogs: '/api/daily-nutrition-logs'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: err.message
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
