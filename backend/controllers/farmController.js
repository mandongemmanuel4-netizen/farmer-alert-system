const FarmLocation = require('../models/FarmLocation');

exports.getMyFarms = async (req, res) => {
  const farms = await FarmLocation.find({ farmer: req.user.id }).sort('-createdAt');
  res.json(farms);
};

exports.createFarm = async (req, res) => {
  try {
    const { farmName, cropType, farmSize, gps } = req.body;

    if (!gps || typeof gps.lat !== 'number' || typeof gps.lng !== 'number') {
      return res.status(400).json({ message: 'Farm GPS location is required' });
    }

    const farm = await FarmLocation.create({ farmer: req.user.id, farmName, cropType, farmSize, gps });
    res.status(201).json(farm);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create farm', error: err.message });
  }
};

exports.updateFarm = async (req, res) => {
  try {
    const farm = await FarmLocation.findOne({ _id: req.params.id, farmer: req.user.id });
    if (!farm) return res.status(404).json({ message: 'Farm not found' });

    const { farmName, cropType, farmSize, gps } = req.body;
    if (farmName) farm.farmName = farmName;
    if (cropType) farm.cropType = cropType;
    if (farmSize) farm.farmSize = farmSize;
    if (gps) farm.gps = gps;

    await farm.save();
    res.json(farm);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update farm', error: err.message });
  }
};

exports.deleteFarm = async (req, res) => {
  const farm = await FarmLocation.findOneAndDelete({ _id: req.params.id, farmer: req.user.id });
  if (!farm) return res.status(404).json({ message: 'Farm not found' });
  res.json({ message: 'Farm deleted' });
};
