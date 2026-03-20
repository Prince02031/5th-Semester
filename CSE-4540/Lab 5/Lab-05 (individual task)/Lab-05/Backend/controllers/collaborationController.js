const Collaboration = require('../models/collaborationModel')
const Player = require('../models/playerModel')
const Developer = require('../models/developerModel')
const Game = require('../models/gameModel')

// create a collaboration request (player submits)
const createCollaborationRequest = async (req, res) => {
  const { playerId, gameId, requestDescription, estimatedHours, milestones } = req.body

  // check if player exists and has premium/elite membership
  const player = await Player.findById(playerId)
  if (!player) {
    return res.status(404).json({ error: 'Player not found' })
  }

  if (player.membershipLevel === 'free') {
    return res.status(400).json({ 
      error: 'Only premium or elite members can submit customization requests' 
    })
  }

  // check if game exists
  const game = await Game.findById(gameId)
  if (!game) {
    return res.status(404).json({ error: 'Game not found' })
  }

  // create collaboration request
  try {
    const collaboration = await Collaboration.create({
      playerId,
      gameId,
      requestDescription,
      estimatedHours,
      milestones: milestones || [],
      status: 'pending'
    })

    const populatedCollab = await Collaboration.findById(collaboration._id)
      .populate('playerId', 'name email membershipLevel')
      .populate('gameId', 'title genre')

    res.status(200).json(populatedCollab)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// get all collaboration requests
const getCollaborationRequests = async (req, res) => {
  const { status, developerId, playerId } = req.query
  let filter = {}

  if (status) {
    filter.status = status
  }
  if (developerId) {
    filter.developerId = developerId
  }
  if (playerId) {
    filter.playerId = playerId
  }

  const collaborations = await Collaboration.find(filter)
    .populate('playerId', 'name email membershipLevel')
    .populate('developerId', 'name email hourlyRate')
    .populate('gameId', 'title genre')
    .sort({ createdAt: -1 })

  res.status(200).json(collaborations)
}

// get a single collaboration request
const getCollaborationRequest = async (req, res) => {
  const { id } = req.params

  const collaboration = await Collaboration.findById(id)
    .populate('playerId', 'name email membershipLevel')
    .populate('developerId', 'name email hourlyRate specializations')
    .populate('gameId', 'title genre rating')

  if (!collaboration) {
    return res.status(404).json({ error: 'Collaboration request not found' })
  }

  res.status(200).json(collaboration)
}

// developer accepts a collaboration request
const acceptCollaborationRequest = async (req, res) => {
  const { id } = req.params
  const { developerId, startDate, endDate } = req.body

  // check if developer exists and is available
  const developer = await Developer.findById(developerId)
  if (!developer) {
    return res.status(404).json({ error: 'Developer not found' })
  }

  if (!developer.available) {
    return res.status(400).json({ error: 'Developer is not available' })
  }

  // find collaboration request
  const collaboration = await Collaboration.findById(id)
  if (!collaboration) {
    return res.status(404).json({ error: 'Collaboration request not found' })
  }

  if (collaboration.status !== 'pending') {
    return res.status(400).json({ 
      error: `Cannot accept request with status: ${collaboration.status}` 
    })
  }

  // calculate total cost
  const totalCost = developer.hourlyRate * collaboration.estimatedHours

  // update collaboration
  collaboration.developerId = developerId
  collaboration.status = 'accepted'
  collaboration.totalCost = totalCost
  collaboration.timeline = {
    startDate: startDate || new Date(),
    endDate: endDate
  }

  await collaboration.save()

  const updatedCollab = await Collaboration.findById(id)
    .populate('playerId', 'name email membershipLevel')
    .populate('developerId', 'name email hourlyRate')
    .populate('gameId', 'title genre')

  res.status(200).json(updatedCollab)
}

// developer rejects a collaboration request
const rejectCollaborationRequest = async (req, res) => {
  const { id } = req.params

  const collaboration = await Collaboration.findById(id)
  if (!collaboration) {
    return res.status(404).json({ error: 'Collaboration request not found' })
  }

  if (collaboration.status !== 'pending') {
    return res.status(400).json({ 
      error: `Cannot reject request with status: ${collaboration.status}` 
    })
  }

  collaboration.status = 'rejected'
  await collaboration.save()

  const updatedCollab = await Collaboration.findById(id)
    .populate('playerId', 'name email membershipLevel')
    .populate('gameId', 'title genre')

  res.status(200).json(updatedCollab)
}

// update collaboration status
const updateCollaborationStatus = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const collaboration = await Collaboration.findById(id)
  if (!collaboration) {
    return res.status(404).json({ error: 'Collaboration request not found' })
  }

  collaboration.status = status
  await collaboration.save()

  const updatedCollab = await Collaboration.findById(id)
    .populate('playerId', 'name email membershipLevel')
    .populate('developerId', 'name email hourlyRate')
    .populate('gameId', 'title genre')

  res.status(200).json(updatedCollab)
}

// update milestone status
const updateMilestone = async (req, res) => {
  const { id, milestoneIndex } = req.params
  const { completed } = req.body

  const collaboration = await Collaboration.findById(id)
  if (!collaboration) {
    return res.status(404).json({ error: 'Collaboration request not found' })
  }

  if (milestoneIndex >= collaboration.milestones.length) {
    return res.status(404).json({ error: 'Milestone not found' })
  }

  collaboration.milestones[milestoneIndex].completed = completed
  if (completed) {
    collaboration.milestones[milestoneIndex].completedDate = new Date()
  }

  await collaboration.save()

  const updatedCollab = await Collaboration.findById(id)
    .populate('playerId', 'name email membershipLevel')
    .populate('developerId', 'name email hourlyRate')
    .populate('gameId', 'title genre')

  res.status(200).json(updatedCollab)
}

// delete collaboration request
const deleteCollaborationRequest = async (req, res) => {
  const { id } = req.params

  const collaboration = await Collaboration.findOneAndDelete({ _id: id })

  if (!collaboration) {
    return res.status(400).json({ error: 'Collaboration request not found' })
  }

  res.status(200).json(collaboration)
}

module.exports = {
  createCollaborationRequest,
  getCollaborationRequests,
  getCollaborationRequest,
  acceptCollaborationRequest,
  rejectCollaborationRequest,
  updateCollaborationStatus,
  updateMilestone,
  deleteCollaborationRequest
}
