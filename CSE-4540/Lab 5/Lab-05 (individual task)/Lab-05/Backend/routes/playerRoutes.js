const express = require('express');

const router = express.Router();
const {
  getPlayers,
  getPlayer,
  createPlayer,
  deletePlayer,
  updatePlayer
} = require('../controllers/playerController');

// GET all players
router.get('/', getPlayers)

// GET a single player
router.get('/:id', getPlayer)

// POST a new player
router.post('/', createPlayer)

// DELETE a player
router.delete('/:id', deletePlayer)

// UPDATE a player
router.patch('/:id', updatePlayer)

module.exports = router;
