const express = require('express');

const router = express.Router();
const {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout
} = require('../controllers/workoutController');

// GET all workouts
router.get('/', getWorkouts)

// GET a single workout
router.get('/:id', (req, res) => {
  res.json({mssg: 'GET a single workout'})
})

// Get all workouts with difficulty filter
router.get('/filter', (req, res) => {
  res.json({mssg: 'GET all workouts with difficulty filter'})
})


// POST a new workout
router.post('/', createWorkout)



// DELETE a workout
router.delete('/:id', (req, res) => {
  res.json({mssg: 'DELETE a workout'})
})

// UPDATE a workout
router.patch('/:id', updateWorkout)




                      



module.exports = router;