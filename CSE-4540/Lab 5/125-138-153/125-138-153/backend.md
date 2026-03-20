# Backend operations with media files

### January 30, 2026

```
For each schema, insert sample input records to demonstrate the 2 features. After
completing the implementation, export all Postman API collections as a JSON file.
Organize all required project files (along with the exported json file) into a single
folder, excluding the nodemodules directory. Create a zip folder with the last 3 digits
of your ID and submit it in the classroom.
```
## FreshTrack+

FreshTrack+ helps households manage groceries efficiently by tracking food freshness,
minimizing waste, and generating personalized daily meal plans based on dietary needs
and calorie requirements.

## System Assumptions

- Users are adults aged between 18 and 60.
- Activity level is assumed to be moderately active.
- Each grocery item has a corresponding nutrition record.

## 1 Schema Design

### 1.1 User Model (userModel.js)

- name (String, required)
- location (String)
- householdSize (Number, required)
- dietaryPreferences (Array of Strings)
- dietaryRestrictions (Array of Strings)
- height (Number, cm, required)


- weight (Number, kg, required)
- age (Number, required)
- profileImage (url, publicId)

### 1.2 Grocery Item Model

Represents individual food items stored in the household.

- name (String, required)
- category (vegetable, fruit, dairy, meat, grain, snack)
- quantity (Number, required)
- unit (g, kg, pcs, litre)
- purchaseDate (Date)
- expiryDate (Date, required)
- storageType (fridge, freezer, pantry)
- images (url, publicId)
- consumptionCount (Number, default 0)
- status (available, consumed, expired, donated)

### 1.3 Nutrition Info Model

Provides nutritional data required for calorie-aware planning.

- foodName (String, required)
- caloriesPerUnit (Number, required)
- protein (Number)
- carbs (Number)
- fat (Number)
- restrictedFor (Array of dietary restrictions)


### 1.4 Meal Model

Stores generated daily meal plans.

- name (String)
- ingredients (Array of GroceryItem references)
- mealType (breakfast, lunch, dinner, snack)
- plannedDate (Date)
- totalCalories (Number)
- cooked (Boolean)

### 1.5 Waste Log Model

Tracks food waste events for analytics.

- groceryItem (Reference)
- wastedQuantity (Number)
- reason (expired, spoiled, forgotten, overcooked)
- date (Date)

### 1.6 Daily Nutrition Log Model

Tracks daily calorie planning performance.

- user (Reference)
- date (Date)
- totalCaloriesPlanned (Number)
- meals (Array of Meal references)
- metCalorieTarget (Boolean)

## 2 Core Features

### 2.1 Food Waste and Consumption Analytics

This feature analyzes grocery usage to identify waste patterns and suggest corrective
actions.

Forgotten Item Detection

- Identifies items past expiry with zero consumption
- Automatically marks them as expired
- Creates a waste log with reason “forgotten”


Smart Donation Suggestions

- Detects items expiring within 2 days
- Excludes frozen items
- Marks items as donated without deletion

### 2.2 Intelligent Expiry- and Calorie-Aware Daily Meal Planning

This feature generates a full-day meal plan optimized for food expiry, dietary rules, and
calorie requirements.

Daily Calorie Calculation
The system uses the Mifflin-St Jeor equation:

```
BM R = (10× weight) + (6. 25 × height)− (5× age)− 161
```
```
DailyCalories = BM R× 1. 55
Calories are distributed as follows:
Meal Calorie Share
Breakfast 25%
Lunch 35%
Dinner 30%
Snack 10%
```
Dietary and Inventory Filtering

- Excludes expired, donated, or out-of-stock items
- Removes foods violating dietary preferences or restrictions
- Ignores items without nutrition data

Meal Generation Process

1. Sort eligible groceries by nearest expiry date
2. Prioritize calorie-dense items
3. Select grocery items from each category recursively until calorie target is reached
    (±10%)
4. Save each meal with calorie breakdown


Post-Processing

- Update grocery quantities
- Increment consumption counters
- Flag unused soon-to-expire items
- Store daily nutrition summary

Final Output

- 4 planned meals
- Calorie-balanced daily plan
- Updated inventory and wasteLog


