const express = require('express');
const router = express.Router();
const {
  getDashboard, getFarmers, toggleFarmerActive,
  getCoordinators, createCoordinator, toggleCoordinatorActive,
  getSecurityPosts, createSecurityPost, deleteSecurityPost,
  getSettings, updateSettings, getActivityLogs, getReports, getLocationStats,
} = require('../controllers/adminController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

router.use(protect, allowRoles('admin'));

router.get('/dashboard', getDashboard);

router.get('/farmers', getFarmers);
router.put('/farmers/:id/toggle-active', toggleFarmerActive);

router.get('/coordinators', getCoordinators);
router.post('/coordinators', createCoordinator);
router.put('/coordinators/:id/toggle-active', toggleCoordinatorActive);

router.get('/security-posts', getSecurityPosts);
router.post('/security-posts', createSecurityPost);
router.delete('/security-posts/:id', deleteSecurityPost);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);

router.get('/activity-logs', getActivityLogs);
router.get('/reports', getReports);
router.get('/location-stats', getLocationStats);

module.exports = router;
