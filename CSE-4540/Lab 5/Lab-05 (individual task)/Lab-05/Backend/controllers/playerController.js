const Player = require('../models/playerModel')

// get all players
const getPlayers = async (req, res) => {
  const { membershipLevel, active } = req.query
  let filter = {}

  if (membershipLevel) {
    filter.membershipLevel = membershipLevel
  }
  if (active !== undefined) {
    filter.active = active === 'true'
  }

  const players = await Player.find(filter).sort({ createdAt: -1 })
  res.status(200).json(players)
}

// get a single player
const getPlayer = async (req, res) => {
  const { id } = req.params

  const player = await Player.findById(id)

  if (!player) {
    return res.status(404).json({ error: 'No such player' })
  }

  res.status(200).json(player)
}

// create a new player
const createPlayer = async (req, res) => {
  const { name, email, age, membershipLevel, active } = req.body

  try {
    const player = await Player.create({ name, email, age, membershipLevel, active })
    res.status(200).json(player)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete a player
const deletePlayer = async (req, res) => {
  const { id } = req.params

  const player = await Player.findOneAndDelete({ _id: id })

  if (!player) {
    return res.status(400).json({ error: 'No such player' })
  }

  res.status(200).json(player)
}

// update a player
const updatePlayer = async (req, res) => {
  const { id } = req.params

  const player = await Player.findOneAndUpdate(
    { _id: id },
    { ...req.body }
  )

  if (!player) {
    return res.status(400).json({ error: 'No such player' })
  }

  res.status(200).json(player)
}

module.exports = {
  getPlayers,
  getPlayer,
  createPlayer,
  deletePlayer,
  updatePlayer
}
