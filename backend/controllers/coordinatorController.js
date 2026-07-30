const User = require('../models/User');
const CheckIn = require('../models/CheckIn');
const Alert = require('../models/Alert');
const SecurityPost = require('../models/SecurityPost');

exports.getDashboard = async (req, res) => {
  const ward = req.user.ward;

  const activeFarmersCount = await User.countDocuments({ role: 'farmer', ward, status: { $in: ['checked-in', 'overdue'] } });
  const activeAlertsCount = await Alert.countDocuments({ ward, status: 'open' });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const resolvedTodayCount = await Alert.countDocuments({ ward, status: 'resolved', resolvedAt: { $gte: startOfToday } });

  const securityPostsCount = await SecurityPost.countDocuments({ ward });

  const recentAlerts = await Alert.find({ ward }).populate('farmer', 'fullName').sort('-createdAt').limit(5);

  res.json({
    activeFarmers: activeFarmersCount,
    activeAlerts: activeAlertsCount,
    resolvedToday: resolvedTodayCount,
    securityPosts: securityPostsCount,
    recentAlerts,
  });
};

exports.getFarmers = async (req, res) => {
  const farmers = await User.find({ role: 'farmer', ward: req.user.ward })
    .select('fullName phone status village')
    .sort('fullName');

  const withSessions = await Promise.all(
    farmers.map(async (f) => {
      const session = await CheckIn.findOne({ farmer: f._id, status: { $in: ['active', 'overdue', 'alert-sent', 'emergency'] } }).populate('farm');
      return { ...f.toObject(), activeSession: session };
    })
  );

  res.json(withSessions);
};

exports.getFarmerDetail = async (req, res) => {
  const farmer = await User.findOne({ _id: req.params.id, role: 'farmer', ward: req.user.ward });
  if (!farmer) return res.status(404).json({ message: 'Farmer not found in your ward' });

  const activeSession = await CheckIn.findOne({ farmer: farmer._id, status: { $in: ['active', 'overdue', 'alert-sent', 'emergency'] } }).populate('farm');
  const history = await CheckIn.find({ farmer: farmer._id, status: { $in: ['completed', 'alert-sent'] } }).sort('-checkInTime').limit(10);

  res.json({ farmer, activeSession, history });
};

exports.getAlerts = async (req, res) => {
  const filter = { ward: req.user.ward };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.type) filter.type = req.query.type;

  const alerts = await Alert.find(filter).populate('farmer', 'fullName phone').sort('-createdAt');
  res.json(alerts);
};

exports.getAlertDetail = async (req, res) => {
  const alert = await Alert.findOne({ _id: req.params.id, ward: req.user.ward })
    .populate('farmer')
    .populate('checkIn')
    .populate('resolvedBy', 'fullName');
  if (!alert) return res.status(404).json({ message: 'Alert not found in your ward' });
  res.json(alert);
};

exports.resolveAlert = async (req, res) => {
  const alert = await Alert.findOne({ _id: req.params.id, ward: req.user.ward });
  if (!alert) return res.status(404).json({ message: 'Alert not found in your ward' });

  alert.status = 'resolved';
  alert.resolvedBy = req.user.id;
  alert.resolutionNotes = req.body.notes || '';
  alert.resolvedAt = new Date();
  await alert.save();

  await User.findByIdAndUpdate(alert.farmer, { status: 'idle' });

  res.json(alert);
};

exports.getMapData = async (req, res) => {
  const ward = req.user.ward;

  const activeCheckIns = await CheckIn.find({ status: { $in: ['active', 'overdue', 'alert-sent', 'emergency'] } })
    .populate({ path: 'farmer', match: { ward }, select: 'fullName status' })
    .populate('farm', 'farmName');

  const farmers = activeCheckIns
    .filter((c) => c.farmer)
    .map((c) => ({
      farmerId: c.farmer._id,
      name: c.farmer.fullName,
      status: c.farmer.status,
      farmName: c.farm?.farmName,
      gps: c.gpsAtCheckIn,
      checkInId: c._id,
    }));

  const securityPosts = await SecurityPost.find({ ward });

  res.json({ farmers, securityPosts });
};
