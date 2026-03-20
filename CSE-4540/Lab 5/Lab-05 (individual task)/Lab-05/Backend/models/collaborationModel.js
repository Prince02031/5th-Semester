const mongoose = require('mongoose')

const Schema = mongoose.Schema

const collaborationSchema = new Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer',
    required: false
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  requestDescription: {
    type: String,
    required: true
  },
  estimatedHours: {
    type: Number,
    required: true,
    min: 1
  },
  totalCost: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  timeline: {
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  },
  milestones: [{
    description: String,
    completed: {
      type: Boolean,
      default: false
    },
    completedDate: Date
  }]
}, { timestamps: true })

module.exports = mongoose.model('Collaboration', collaborationSchema)
