const mongoose = require('mongoose')

const Schema = mongoose.Schema

const developerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  specializations: {
    type: [String],
    enum: ['RPG', 'FPS', 'Puzzle', 'Strategy', 'Simulation']
  },
  experienceYears: {
    type: Number,
    min: 1
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 10
  },
  available: {
    type: Boolean,
    default: true
  },
  certifications: {
    type: [String]
  }
}, { timestamps: true })

module.exports = mongoose.model('Developer', developerSchema)
