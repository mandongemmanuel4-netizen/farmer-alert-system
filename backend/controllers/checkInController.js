const CheckIn = require('../models/CheckIn');
const FarmLocation = require('../models/FarmLocation');
const User = require('../models/User');
const Alert = require('../models/Alert');
const LocationHistory = require('../models/LocationHistory');
const { dispatchAlertSms } = require('../services/smsService');

exports.getActiveSession = async (req, res) => {
  const session = await CheckIn.findOne({ farmer: req.user.id, status: 'active' }).populate('farm');
  res.json(session);
};

exports.checkIn = async (req, res) => {
  try {
    const { farmId, expectedReturnBy, gps } = req.body;

    if (!farmId || !expectedReturnBy || !gps) {
      return res.status(400).json({ message: 'farmId, expectedReturnBy, and gps are required' });
    }

    const farm = await FarmLocation.findOne({ _id: farmId, farmer: req.user.id });
    if (!farm) return res.status(404).json({ message: 'Farm not found' });

    const existing = await CheckIn.findOne({ farmer: req.user.id, status: 'active' });
    if (existing) return res.status(400).json({ message: 'You already have an active check-in. Check out first.' });

    const checkIn = await CheckIn.create({
      farmer: req.user.id,
      farm: farmId,
      expectedReturnBy: new Date(expectedReturnBy),
      gpsAtCheckIn: gps,
    });

    await User.findByIdAndUpdate(req.user.id, { status: 'checked-in' });
    await LocationHistory.create({ checkIn: checkIn._id, farmer: req.user.id, lat: gps.lat, lng: gps.lng });

    res.status(201).json(checkIn);
  } catch (err) {
    res.status(500).json({ message: 'Check-in failed', error: err.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const checkIn = await CheckIn.findOne({ _id: req.params.id, farmer: req.user.id, status: 'active' });
    if (!checkIn) return res.status(404).json({ message: 'Active check-in not found' });

    checkIn.checkOutTime = new Date();
    checkIn.status = 'completed';
    await checkIn.save();

    await User.findByIdAndUpdate(req.user.id, { status: 'idle' });

    res.json(checkIn);
  } catch (err) {
    res.status(500).json({ message: 'Check-out failed', error: err.message });
  }
};

exports.pingLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const checkIn = await CheckIn.findOne({ _id: req.params.id, farmer: req.user.id, status: 'active' });
    if (!checkIn) return res.status(404).json({ message: 'Active check-in not found' });

    await LocationHistory.create({ checkIn: checkIn._id, farmer: req.user.id, lat, lng });
    res.json({ message: 'Location updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update location', error: err.message });
  }
};

exports.panic = async (req, res) => {
  try {
    const { gps } = req.body;
    if (!gps) return res.status(400).json({ message: 'Current GPS location is required' });

    const user = await User.findById(req.user.id).populate('ward');
    const activeCheckIn = await CheckIn.findOne({ farmer: req.user.id, status: 'active' });

    if (activeCheckIn) {
      activeCheckIn.status = 'emergency';
      await activeCheckIn.save();
    }
    await User.findByIdAndUpdate(req.user.id, { status: 'emergency' });

    const alert = await Alert.create({
      farmer: req.user.id,
      checkIn: activeCheckIn ? activeCheckIn._id : null,
      type: 'panic',
      gps,
      ward: user.ward,
      recipients: [],
    });

    const recipients = await dispatchAlertSms(alert, user);
    alert.recipients = recipients;
    await alert.save();

    res.status(201).json({ message: 'Emergency alert triggered', alert });
  } catch (err) {
    res.status(500).json({ message: 'Failed to trigger panic alert', error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  const history = await CheckIn.find({ farmer: req.user.id, status: { $ne: 'active' } })
    .populate('farm')
    .sort('-checkInTime')
    .limit(50);
  res.json(history);
};
