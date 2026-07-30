const express = require('express');
const router = express.Router();
const {
  getDashboard, getFarmers, getFarmerDetail,
  getAlerts, getAlertDetail, resolveAlert, getMapData,
} = require('../controllers/coordinatorController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

router.use(protect, allowRoles('coordinator'));

router.get('/dashboard', getDashboard);
router.get('/farmers', getFarmers);
router.get('/farmers/:id', getFarmerDetail);
router.get('/alerts', getAlerts);
router.get('/alerts/:id', getAlertDetail);
router.put('/alerts/:id/resolve', resolveAlert);
router.get('/map', getMapData);

module.exports = router;
