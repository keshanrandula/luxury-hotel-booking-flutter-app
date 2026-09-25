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
    const { name, email, password, role, phone, country } = req.body;

    let user;
    try {
      user = await User.create({
        name,
        email,
        password,
        role: role || 'member',
        tier: 'Silver Prestige',
        points: 5000,
        phone: phone || '+94 77 123 4567',
        country: country || 'Sri Lanka',
      });
    } catch (_) {}

    const savedUser = store.addUser({
      name,
      email,
      role: role || 'member',
      tier: 'Silver Prestige',
      points: 5000,
      phone: phone || '+94 77 123 4567',
      country: country || 'Sri Lanka',
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
    const { email, password, phone, country } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    // 1. Sync with MongoDB
    let mongoUser;
    try {
      mongoUser = await User.findOne({ email: cleanEmail });
      if (mongoUser) {
        if (phone) mongoUser.phone = phone;
        if (country) mongoUser.country = country;
        await mongoUser.save();
      } else if (cleanEmail) {
        const namePart = cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        mongoUser = await User.create({
          name: namePart || 'VIP Member',
          email: cleanEmail,
          password: password || 'defaultPass123',
          phone: phone || '+94 77 123 4567',
          country: country || 'Sri Lanka',
          role: 'member',
          tier: 'Silver Prestige',
          points: 5000,
        });
      }
    } catch (_) {}

    // 2. Sync with dataStore
    const allUsers = store.getUsers();
    const existing = allUsers.find((u) => u.email && u.email.toLowerCase() === cleanEmail);

    let userObj;
    if (existing) {
      if (phone) existing.phone = phone;
      if (country) existing.country = country;
      store.save();
      userObj = existing;
    } else {
      const name = cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      userObj = store.addUser({
        name: name || 'VIP Member',
        email: cleanEmail,
        phone: phone || '+94 77 123 4567',
        country: country || 'Sri Lanka',
        role: 'member',
        tier: 'Silver Prestige',
        points: 5000,
      });
    }

    const token = generateToken(userObj._id, userObj.role || 'member');

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
    let mongoUsers = [];
    try {
      mongoUsers = await User.find().sort('-createdAt');
    } catch (_) {}

    const storeUsers = store.getUsers() || [];
    
    // Merge users uniquely by email
    const usersMap = new Map();

    // Add store users
    storeUsers.forEach((u) => {
      if (u.email) {
        usersMap.set(u.email.toLowerCase(), {
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.role || 'member',
          tier: u.tier || 'Silver Prestige',
          points: u.points || 5000,
          phone: u.phone,
          country: u.country,
          avatarUrl: u.avatarUrl || '',
          createdAt: u.createdAt || new Date().toISOString(),
        });
      }
    });

    // Add/overwrite with MongoDB users
    mongoUsers.forEach((u) => {
      if (u.email) {
        usersMap.set(u.email.toLowerCase(), {
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.role || 'member',
          tier: u.tier || 'Silver Prestige',
          points: u.points || 5000,
          phone: u.phone,
          country: u.country,
          avatarUrl: u.avatarUrl || '',
          createdAt: u.createdAt || new Date().toISOString(),
        });
      }
    });

    const users = Array.from(usersMap.values());

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};
