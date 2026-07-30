const express = require('express');
const router = express.Router();
const {
  getStates, getLGAs, getWards,
  createState, createLGA, createWard,
} = require('../controllers/locationController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

router.get('/states', getStates);
router.get('/lgas', getLGAs);
router.get('/wards', getWards);

router.post('/states', protect, allowRoles('admin'), createState);
router.post('/lgas', protect, allowRoles('admin'), createLGA);
router.post('/wards', protect, allowRoles('admin'), createWard);

module.exports = router;
