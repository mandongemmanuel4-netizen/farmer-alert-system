const bcrypt = require('bcryptjs');
const User = require('../models/User');
const FarmLocation = require('../models/FarmLocation');
const Alert = require('../models/Alert');
const SecurityPost = require('../models/SecurityPost');
const SystemSettings = require('../models/SystemSettings');
const ActivityLog = require('../models/ActivityLog');
const State = require('../models/State');
const LGA = require('../models/LGA');
const Ward = require('../models/Ward');

async function logActivity(userId, action, details = {}) {
  try { await ActivityLog.create({ user: userId, action, details }); } catch (e) { /* non-critical */ }
}

// GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  const totalFarmers = await User.countDocuments({ role: 'farmer' });
  const totalCoordinators = await User.countDocuments({ role: 'coordinator' });
  const totalFarms = await FarmLocation.countDocuments();
  const activeAlerts = await Alert.countDocuments({ status: 'open' });
  const totalSecurityPosts = await SecurityPost.countDocuments();
  const activeSessions = await User.countDocuments({ role: 'farmer', status: { $in: ['checked-in', 'overdue'] } });

  const panicCount = await Alert.countDocuments({ type: 'panic' });
  const timeoutCount = await Alert.countDocuments({ type: 'timeout' });
  const resolvedCount = await Alert.countDocuments({ status: 'resolved' });

  const recentActivity = await ActivityLog.find().populate('user', 'fullName').sort('-createdAt').limit(6);

  res.json({
    totalFarmers, totalCoordinators, totalFarms, activeAlerts, totalSecurityPosts, activeSessions,
    alertsOverview: { panic: panicCount, timeout: timeoutCount, resolved: resolvedCount },
    recentActivity,
  });
};

// GET /api/admin/farmers
exports.getFarmers = async (req, res) => {
  const farmers = await User.find({ role: 'farmer' })
    .populate('ward', 'name')
    .select('fullName phone status ward createdAt')
    .sort('-createdAt');
  res.json(farmers);
};

// PUT /api/admin/farmers/:id/toggle-active
exports.toggleFarmerActive = async (req, res) => {
  const farmer = await User.findOne({ _id: req.params.id, role: 'farmer' });
  if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
  farmer.isActive = !farmer.isActive;
  await farmer.save();
  await logActivity(req.user.id, farmer.isActive ? 'farmer_activated' : 'farmer_deactivated', { farmerId: farmer._id });
  res.json(farmer);
};

// GET /api/admin/coordinators
exports.getCoordinators = async (req, res) => {
  const coordinators = await User.find({ role: 'coordinator' })
    .populate('ward', 'name')
    .select('fullName phone status ward isActive createdAt')
    .sort('-createdAt');
  res.json(coordinators);
};

// POST /api/admin/coordinators — the real "Admin creates CSO account" flow
exports.createCoordinator = async (req, res) => {
  try {
    const { fullName, phone, pin, wardId } = req.body;

    if (!pin || !/^\d{4}$/.test(pin)) return res.status(400).json({ message: 'PIN must be exactly 4 digits' });
    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ message: 'Phone number already registered' });

    const ward = await Ward.findById(wardId);
    if (!ward) return res.status(400).json({ message: 'Invalid ward' });

    const hashedPin = await bcrypt.hash(pin, 10);
    const coordinator = await User.create({
      fullName, phone, pin: hashedPin, role: 'coordinator', ward: wardId, isActive: true,
    });

    await logActivity(req.user.id, 'coordinator_created', { coordinatorId: coordinator._id, ward: ward.name });
    res.status(201).json(coordinator);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create coordinator', error: err.message });
  }
};

// PUT /api/admin/coordinators/:id/toggle-active
exports.toggleCoordinatorActive = async (req, res) => {
  const coordinator = await User.findOne({ _id: req.params.id, role: 'coordinator' });
  if (!coordinator) return res.status(404).json({ message: 'Coordinator not found' });
  coordinator.isActive = !coordinator.isActive;
  await coordinator.save();
  await logActivity(req.user.id, coordinator.isActive ? 'coordinator_activated' : 'coordinator_deactivated', { coordinatorId: coordinator._id });
  res.json(coordinator);
};

// ---------- Security Posts ----------
exports.getSecurityPosts = async (req, res) => {
  const posts = await SecurityPost.find().populate('ward', 'name');
  res.json(posts);
};

exports.createSecurityPost = async (req, res) => {
  try {
    const post = await SecurityPost.create(req.body);
    await logActivity(req.user.id, 'security_post_created', { postId: post._id });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create security post', error: err.message });
  }
};

exports.deleteSecurityPost = async (req, res) => {
  await SecurityPost.findByIdAndDelete(req.params.id);
  res.json({ message: 'Security post deleted' });
};

// ---------- System Settings ----------
exports.getSettings = async (req, res) => {
  let settings = await SystemSettings.findOne();
  if (!settings) settings = await SystemSettings.create({});
  res.json(settings);
};

exports.updateSettings = async (req, res) => {
  let settings = await SystemSettings.findOne();
  if (!settings) settings = await SystemSettings.create({});
  Object.assign(settings, req.body, { updatedAt: new Date() });
  await settings.save();
  await logActivity(req.user.id, 'settings_updated', {});
  res.json(settings);
};

// ---------- Activity Logs ----------
exports.getActivityLogs = async (req, res) => {
  const logs = await ActivityLog.find().populate('user', 'fullName role').sort('-createdAt').limit(100);
  res.json(logs);
};

// ---------- Reports & Analytics ----------
exports.getReports = async (req, res) => {
  const totalAlerts = await Alert.countDocuments();
  const panicAlerts = await Alert.countDocuments({ type: 'panic' });
  const timeoutAlerts = await Alert.countDocuments({ type: 'timeout' });
  const resolvedAlerts = await Alert.countDocuments({ status: 'resolved' });

  const alertsByWard = await Alert.aggregate([
    { $group: { _id: '$ward', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
  const wardIds = alertsByWard.map((a) => a._id).filter(Boolean);
  const wards = await Ward.find({ _id: { $in: wardIds } });
  const wardMap = Object.fromEntries(wards.map((w) => [w._id.toString(), w.name]));

  res.json({
    totalAlerts, panicAlerts, timeoutAlerts, resolvedAlerts,
    alertsByWard: alertsByWard.map((a) => ({ ward: wardMap[a._id?.toString()] || 'Unknown', count: a.count })),
  });
};

// ---------- Location management stats (states/LGAs/wards counts, for the management screens) ----------
exports.getLocationStats = async (req, res) => {
  const states = await State.find().sort('name');
  const stats = await Promise.all(
    states.map(async (s) => ({
      _id: s._id,
      name: s.name,
      lgaCount: await LGA.countDocuments({ state: s._id }),
    }))
  );
  res.json(stats);
};
