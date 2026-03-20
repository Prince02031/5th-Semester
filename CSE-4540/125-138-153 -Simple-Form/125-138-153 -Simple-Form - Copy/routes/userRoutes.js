const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser
} = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.post('/', upload.single('profileImage'), createUser);

router.delete('/:id', deleteUser);

router.patch('/:id', upload.single('profileImage'), updateUser);

module.exports = router;
