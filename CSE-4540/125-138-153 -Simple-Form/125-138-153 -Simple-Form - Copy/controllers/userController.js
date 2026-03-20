const User = require('../models/userModel');

const getAllUsers = async (req, res) => {
  const users = await User.find().sort({createdAt: -1});
  res.status(200).json(users);
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({error: 'No such user'});
  }

  res.status(200).json(user);
};

const createUser = async (req, res) => {
  try {
    const userData = { ...req.body };
    if (req.file) {
      userData.profileImage = {
        url: `/uploads/${req.file.filename}`,
        publicId: req.file.filename
      };
    }
    const user = await User.create(userData);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndDelete({_id: id});

  if(!user) {
    return res.status(400).json({error: 'No such user'});
  }

  res.status(200).json(user);
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  if (req.file) {
    updateData.profileImage = {
      url: `/uploads/${req.file.filename}`,
      publicId: req.file.filename
    };
  }
  const user = await User.findOneAndUpdate({_id: id}, updateData, {new: true});

  if (!user) {
    return res.status(400).json({error: 'No such user'});
  }

  res.status(200).json(user);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser
};
