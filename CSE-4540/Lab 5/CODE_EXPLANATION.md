# Food Waste Management API - Code Explanation

## 📋 Project Overview
This is a **Food Waste Management & Meal Planning API** built with Node.js, Express, and MongoDB. It helps users track grocery items, plan meals, monitor nutrition, and reduce food waste.

---

## 📁 Project Structure

```
├── index.js                    # Main server file
├── package.json               # Project dependencies
├── .env                       # Environment variables (MongoDB URI, PORT)
├── config/
│   └── database.js           # MongoDB connection configuration
├── models/                    # Database schemas (6 models)
├── controllers/              # Business logic (6 controllers)
├── routes/                   # API endpoints (6 route files)
└── middleware/               # File upload middleware
```

---

## 🚀 Main Server File: `index.js`

### What It Does:
This is the **entry point** of our application. It sets up the Express server and connects to MongoDB.

### Code Breakdown:

```javascript
const express = require('express');
const app = express();
```
- Import Express framework
- Create an Express application instance

```javascript
require('dotenv').config();
const PORT = process.env.PORT || 5000;
```
- Load environment variables from `.env` file
- Set port to 5000 (or from environment variable)

```javascript
const cors = require('cors');
app.use(cors());
```
- Enable CORS (Cross-Origin Resource Sharing)
- Allows frontend applications to access our API

```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```
- Middleware to parse JSON request bodies
- Middleware to parse URL-encoded data (from forms)

```javascript
app.use('/uploads', express.static('uploads'));
```
- Serve uploaded images from the `uploads` folder as static files
- Accessible via `http://localhost:5000/uploads/filename.jpg`

```javascript
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
```
- Import route files
- Mount routes at specific paths (e.g., `/api/users`)
- All user-related endpoints start with `/api/users`

```javascript
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
```
- Connect to MongoDB using connection string from `.env`
- If successful: start the server on port 5000
- If failed: show error message

---

## 📦 Models (Database Schemas)

Models define the **structure of data** stored in MongoDB.

### 1. `userModel.js` - User Information

```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  // ... other fields
}, { timestamps: true });
```

**Fields:**
- `name`: User's full name (required)
- `location`: Where user lives (required)
- `householdSize`: Number of people in household (required, minimum 1)
- `dietaryPreferences`: Array of diet preferences (e.g., ["Vegetarian", "Keto"])
- `dietaryRestrictions`: Array of food restrictions (e.g., ["Peanuts", "Dairy"])
- `height`, `weight`, `age`: Physical info for nutrition tracking
- `profileImage`: Object with `url` and `publicId` for image storage
- `timestamps`: Automatically adds `createdAt` and `updatedAt` fields

### 2. `groceryItemModel.js` - Grocery Items

**Purpose:** Track food items in user's inventory

**Fields:**
- `name`: Item name (e.g., "Milk", "Apples")
- `category`: Food category (enum: `vegetable`, `fruit`, `dairy`, `meat`, `grain`, `snack`)
- `quantity` & `unit`: Amount and measurement unit (enum: `g`, `kg`, `pcs`, `litre`)
- `purchaseDate`: When item was bought
- `expiryDate`: When item expires (important for waste tracking!)
- `storageType`: Where stored (enum: `fridge`, `freezer`, `pantry`)
- `images`: Array of image objects with `url` and `publicId`
- `consumptionCount`: How many times used (default: 0)
- `status`: Current state (enum: `available`, `consumed`, `expired`, `donated`)

### 3. `nutritionInfoModel.js` - Food Nutrition Data

**Purpose:** Store nutritional information for different foods

**Fields:**
- `foodName`: Name of food (unique - no duplicates)
- `caloriesPerUnit`: Calories per serving
- `protein`, `carbs`, `fat`: Macronutrients in grams
- `restrictedFor`: Array of dietary restrictions (e.g., ["Vegan", "Gluten-Free"])

### 4. `mealModel.js` - Planned Meals

**Purpose:** Track meal plans

**Fields:**
- `name`: Meal name (e.g., "Chicken Salad")
- `ingredients`: Array of references to `GroceryItem` IDs
- `mealType`: Breakfast, Lunch, Dinner, or Snack
- `plannedDate`: When meal is scheduled
- `totalCalories`: Sum of calories in meal
- `cooked`: Boolean - whether meal was prepared

### 5. `wasteLogModel.js` - Food Waste Tracking

**Purpose:** Track wasted food items for analytics

**Fields:**
- `groceryItem`: Reference to wasted grocery item ID
- `wastedQuantity`: Amount wasted
- `reason`: Why it was wasted (enum: `expired`, `spoiled`, `forgotten`, `overcooked`)
- `date`: When waste occurred

### 6. `dailyNutritionLogModel.js` - Daily Nutrition Tracking

**Purpose:** Track user's daily nutrition and meal plans

**Fields:**
- `user`: Reference to User ID
- `date`: Date of the log
- `totalCaloriesPlanned`: Target calories for the day
- `meals`: Array of Meal IDs planned for the day
- `metCalorieTarget`: Boolean - did user meet their target?

---

## 🎮 Controllers (Business Logic)

Controllers handle the **actual operations** - they process requests and return responses.

### Common Pattern in All Controllers:

```javascript
const ModelName = require('../models/modelName');

// Get all items
const getAll = async (req, res) => {
  const items = await ModelName.find().sort({createdAt: -1});
  res.status(200).json(items);
};

// Get single item
const getById = async (req, res) => {
  const { id } = req.params;
  const item = await ModelName.findById(id);

  if (!item) {
    return res.status(404).json({error: 'Not found'});
  }

  res.status(200).json(item);
};

// Create new item
const create = async (req, res) => {
  try {
    const item = await ModelName.create(req.body);
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  const { id } = req.params;
  const item = await ModelName.findOneAndDelete({_id: id});

  if(!item) {
    return res.status(400).json({error: 'Not found'});
  }

  res.status(200).json(item);
};

// Update item
const update = async (req, res) => {
  const { id } = req.params;
  const item = await ModelName.findOneAndUpdate({_id: id}, {
    ...req.body
  }, {new: true});

  if (!item) {
    return res.status(400).json({error: 'Not found'});
  }

  res.status(200).json(item);
};

module.exports = { getAll, getById, create, deleteItem, update };
```

### Key Concepts:

1. **`async/await`**: Handle asynchronous database operations
2. **`req.params.id`**: Get ID from URL (e.g., `/api/users/123`)
3. **`req.body`**: Get data sent in request body
4. **`res.status(200).json(data)`**: Send response with status code and data
5. **`.find()`**: Get all documents
6. **`.findById(id)`**: Get single document by ID
7. **`.create(data)`**: Create new document
8. **`.findOneAndDelete()`**: Find and delete document
9. **`.findOneAndUpdate()`**: Find and update document, `{new: true}` returns updated document
10. **`.sort({createdAt: -1})`**: Sort by newest first (-1 = descending)
11. **`.populate('field')`**: Replace ID references with actual data from other collections

### Special Controller Functions:

**`groceryItemController.js`:**
- `getExpiringItems()`: Finds available items expiring within 7 days
- `processForgottenItems()`: **Feature 2.1a** — Scans for items past expiry with `consumptionCount === 0`, marks them `expired`, auto-creates waste logs with reason `forgotten`
- `processDonationSuggestions()`: **Feature 2.1b** — Finds `available`, non-frozen items expiring within 2 days and marks them `donated`

**`wasteLogController.js`:**
- `createWasteLog()`: Creates waste log AND updates the linked grocery item status
- `getWasteAnalytics()`: Calculates total waste, waste by reason, waste by category with optional date range filter

**`mealController.js`:**
- `getMealsByDateRange()`: Get meals between start and end dates
- `generateMealPlan(userId)`: **Feature 2.2** — Fetches user height/weight/age, calculates BMR via Mifflin-St Jeor equation (×1.55 activity multiplier), splits daily calories into 4 meal targets (Breakfast 25%, Lunch 35%, Dinner 30%, Snack 10%), filters eligible groceries by expiry/dietary restrictions/nutrition data, selects ingredients round-robin by category sorted by nearest expiry, saves 4 `Meal` documents, updates inventory quantities and `consumptionCount`, flags unused soon-to-expire items, and creates a `DailyNutritionLog`

**`dailyNutritionLogController.js`:**
- `getDailyNutritionLogsByUser()`: Get all logs for a specific user

---

## 🛣️ Routes (API Endpoints)

Routes define **what URLs** the API responds to.

### Common Pattern:

```javascript
const express = require('express');
const router = express.Router();
const {
  getAll,
  getById,
  create,
  deleteItem,
  update
} = require('../controllers/controllerName');

// GET all items
router.get('/', getAll);

// GET a single item
router.get('/:id', getById);

// POST a new item
router.post('/', create);

// DELETE an item
router.delete('/:id', deleteItem);

// UPDATE an item
router.patch('/:id', update);

module.exports = router;
```

### HTTP Methods:
- **GET**: Retrieve data (read)
- **POST**: Create new data
- **PATCH/PUT**: Update existing data
- **DELETE**: Remove data

### Route Parameters:
- `/:id` - Dynamic parameter in URL
- Example: `GET /api/users/123` → `req.params.id = "123"`

### All API Endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users` | GET | Get all users |
| `/api/users/:id` | GET | Get user by ID |
| `/api/users` | POST | Create new user (form-data, supports `profileImage` file) |
| `/api/users/:id` | PATCH | Update user (form-data, supports `profileImage` file) |
| `/api/users/:id` | DELETE | Delete user |
| `/api/grocery-items` | GET | Get all items |
| `/api/grocery-items/expiring` | GET | Get available items expiring within 7 days |
| `/api/grocery-items/process-forgotten` | POST | **Feature 2.1a**: Auto-detect forgotten expired items |
| `/api/grocery-items/process-donations` | POST | **Feature 2.1b**: Auto-suggest and mark donations |
| `/api/grocery-items/:id` | GET | Get item by ID |
| `/api/grocery-items` | POST | Create item (form-data, supports `images` files) |
| `/api/grocery-items/:id` | PATCH | Update item (form-data, supports `images` files) |
| `/api/grocery-items/:id` | DELETE | Delete item |
| `/api/nutrition-info` | GET | Get all nutrition info |
| `/api/nutrition-info/:id` | GET | Get nutrition info by ID |
| `/api/nutrition-info` | POST | Create nutrition info |
| `/api/nutrition-info/:id` | PATCH | Update nutrition info |
| `/api/nutrition-info/:id` | DELETE | Delete nutrition info |
| `/api/meals` | GET | Get all meals |
| `/api/meals/date-range?startDate=...&endDate=...` | GET | Get meals in date range |
| `/api/meals/generate-plan/:userId` | POST | **Feature 2.2**: Generate calorie-aware daily meal plan |
| `/api/meals` | POST | Create meal |
| `/api/meals/:id` | GET | Get meal by ID |
| `/api/meals/:id` | PATCH | Update meal |
| `/api/meals/:id` | DELETE | Delete meal |
| `/api/waste-logs` | GET | Get all waste logs |
| `/api/waste-logs/analytics?startDate=...&endDate=...` | GET | Get waste analytics |
| `/api/waste-logs` | POST | Create waste log |
| `/api/waste-logs/:id` | GET | Get waste log by ID |
| `/api/waste-logs/:id` | PATCH | Update waste log |
| `/api/waste-logs/:id` | DELETE | Delete waste log |
| `/api/daily-nutrition-logs` | GET | Get all daily logs |
| `/api/daily-nutrition-logs/user/:userId` | GET | Get logs by user |
| `/api/daily-nutrition-logs` | POST | Create daily log |
| `/api/daily-nutrition-logs/:id` | GET | Get daily log by ID |
| `/api/daily-nutrition-logs/:id` | PATCH | Update daily log |
| `/api/daily-nutrition-logs/:id` | DELETE | Delete daily log |

---

## 🔧 Middleware: `uploadMiddleware.js`

### Purpose:
Handle file uploads (images) using **Multer** library.

### Code Breakdown:

```javascript
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
```
- **`destination`**: Save files to `uploads/` folder
- **`filename`**: Create unique filename using timestamp + random number + original extension
- Example: `profileImage-1708435200000-123456789.jpg`

```javascript
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};
```
- **File validation**: Only allow image files (jpeg, jpg, png, gif)
- Check both file extension and MIME type for security

```javascript
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});
```
- Configure multer with storage, file size limit (5MB), and filter

### Usage:
```javascript
// In routes
router.post('/upload', upload.single('image'), uploadController);
```

---

## 📦 Dependencies: `package.json`

### Main Dependencies:

1. **express** - Web framework for Node.js
2. **mongoose** - MongoDB object modeling tool
3. **dotenv** - Load environment variables from `.env` file
4. **cors** - Enable Cross-Origin Resource Sharing
5. **multer** - File upload middleware
6. **cloudinary** - Cloud storage for images (optional)
7. **express-validator** - Input validation middleware

### Dev Dependencies:

1. **nodemon** - Auto-restart server on file changes during development

### Scripts:
- `npm start` - Run server normally
- `npm run dev` - Run with nodemon (development mode)

---

## 🔑 Environment Variables: `.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
```

**Important:** Never commit `.env` to Git! It contains sensitive information.

---

## 🔄 How Everything Works Together

### Example: Creating a New User

1. **Client** sends POST request:
   ```
   POST http://localhost:5000/api/users
   Body: { "name": "John", "location": "NYC", ... }
   ```

2. **index.js** receives request and routes it to `userRoutes`

3. **userRoutes.js** matches route and calls `createUser` controller

4. **userController.js** `createUser` function:
   - Receives data from `req.body`
   - Uses `User.create()` to save to database
   - Returns response with created user data

5. **MongoDB** stores the data and returns confirmation

6. **Client** receives response:
   ```json
   {
     "_id": "65abc123...",
     "name": "John",
     "location": "NYC",
     ...
   }
   ```

---

## 🎯 Key Concepts to Explain to Teacher

### 1. **MVC-like Architecture**
- **Models**: Define data structure (what data looks like)
- **Controllers**: Handle business logic (what to do with data)
- **Routes**: Define API endpoints (how to access data)

### 2. **RESTful API Design**
- Uses standard HTTP methods (GET, POST, PATCH, DELETE)
- Resource-based URLs (`/api/users`, `/api/meals`)
- Stateless communication

### 3. **Async/Await Pattern**
- Handles asynchronous database operations
- Makes code cleaner than callbacks
- Uses try-catch for error handling

### 4. **MongoDB & Mongoose**
- **MongoDB**: NoSQL database (stores data as documents)
- **Mongoose**: ODM (Object Data Modeling) library
- Schema validation ensures data quality

### 5. **Middleware**
- Functions that run between request and response
- Examples: `express.json()`, `cors()`, file upload handler

### 6. **Error Handling**
- 404: Not found
- 400: Bad request (invalid data)
- 200: Success
- 500: Server error

---

## 🚀 How to Run the Project

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```

3. **Start Server:**
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

4. **Test with Postman:**
   - Import the `.postman_collection.json` file
   - Test all endpoints

---

## 💡 What Makes This Project Good?

1. ✅ **Organized Structure**: Clear separation of concerns
2. ✅ **Beginner-Friendly**: Simple, readable code
3. ✅ **Complete CRUD**: All basic operations implemented
4. ✅ **Data Validation**: Mongoose schemas validate input
5. ✅ **Error Handling**: Proper error responses
6. ✅ **Real-World Use Case**: Solves actual problem (food waste)
7. ✅ **Scalable**: Easy to add new features

---

## 📚 Learning Points

This project demonstrates understanding of:
- Node.js & Express fundamentals
- MongoDB & Mongoose
- RESTful API design
- Async JavaScript
- File handling
- Environment configuration
- Error handling
- Code organization

---

**Created for Mid-Term Project Demonstration**  
*Last Updated: February 20, 2026*
