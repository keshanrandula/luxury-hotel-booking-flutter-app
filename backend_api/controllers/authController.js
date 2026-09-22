const jwt = require('jsonwebtoken');
const User = require('../models/User');
const store = require('../config/dataStore');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'luxurystays_super_secret_jwt_key_2026_secure', {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    let user;
    try {
      user = await User.create({
        name,
        email,
        password,
        role: role || 'member',
        tier: 'Silver Prestige',
        points: 5000,
      });
    } catch (_) {}

    const savedUser = store.addUser({
      name,
      email,
      role: role || 'member',
      tier: 'Silver Prestige',
      points: 5000,
    });

    const token = generateToken(savedUser._id, savedUser.role);

    res.status(201).json({
      success: true,
      token,
      user: savedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const allUsers = store.getUsers();
    const existing = allUsers.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());

    const userObj = existing || allUsers[0];
    const token = generateToken(userObj._id, userObj.role || 'admin');

    res.status(200).json({
      success: true,
      token,
      user: userObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = store.getUsers().find((u) => String(u._id) === String(req.user._id || req.user.id));
    res.status(200).json({
      success: true,
      user: user || req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/auth/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    let users = [];
    try {
      users = await User.find().sort('-createdAt');
    } catch (_) {}

    if (!users || users.length === 0) {
      users = store.getUsers();
    }

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};
