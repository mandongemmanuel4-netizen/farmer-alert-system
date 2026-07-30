const State = require('../models/State');
const LGA = require('../models/LGA');
const Ward = require('../models/Ward');

exports.getStates = async (req, res) => {
  const states = await State.find().sort('name');
  res.json(states);
};

exports.getLGAs = async (req, res) => {
  const filter = req.query.state ? { state: req.query.state } : {};
  const lgas = await LGA.find(filter).sort('name');
  res.json(lgas);
};

exports.getWards = async (req, res) => {
  const filter = req.query.lga ? { lga: req.query.lga } : {};
  const wards = await Ward.find(filter).sort('name');
  res.json(wards);
};

exports.createState = async (req, res) => {
  try {
    const state = await State.create({ name: req.body.name });
    res.status(201).json(state);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create state', error: err.message });
  }
};

exports.createLGA = async (req, res) => {
  try {
    const lga = await LGA.create({ name: req.body.name, state: req.body.state });
    res.status(201).json(lga);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create LGA', error: err.message });
  }
};

exports.createWard = async (req, res) => {
  try {
    const ward = await Ward.create({ name: req.body.name, lga: req.body.lga });
    res.status(201).json(ward);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create ward', error: err.message });
  }
};
