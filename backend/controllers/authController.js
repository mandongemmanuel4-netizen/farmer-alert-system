const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, ward: user.ward },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

exports.registerFarmer = async (req, res) => {
  try {
    const { fullName, phone, gender, pin, state, lga, ward, village } = req.body;

    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ message: 'PIN must be exactly 4 digits' });
    }

    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    const user = await User.create({
      fullName, phone, gender, pin: hashedPin, role: 'farmer', state, lga, ward, village,
    });

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, fullName: user.fullName, phone: user.phone, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, pin } = req.body;

    const user = await User.findOne({ phone });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid phone number or PIN' });
    }

    const match = await bcrypt.compare(pin, user.pin);
    if (!match) {
      return res.status(401).json({ message: 'Invalid phone number or PIN' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id, fullName: user.fullName, phone: user.phone,
        role: user.role, ward: user.ward, status: user.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.changePin = async (req, res) => {
  try {
    const { currentPin, newPin } = req.body;
    if (!newPin || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      return res.status(400).json({ message: 'New PIN must be exactly 4 digits' });
    }

    const user = await User.findById(req.user.id);
    const match = await bcrypt.compare(currentPin, user.pin);
    if (!match) {
      return res.status(401).json({ message: 'Current PIN is incorrect' });
    }

    user.pin = await bcrypt.hash(newPin, 10);
    await user.save();
    res.json({ message: 'PIN updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to change PIN', error: err.message });
  }
};
