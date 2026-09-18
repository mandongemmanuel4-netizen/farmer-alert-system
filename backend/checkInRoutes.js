const express = require('express');
const router = express.Router();
const {
  getActiveSession, checkIn, checkOut, pingLocation, panic, getHistory,
} = require('../controllers/checkInController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

router.post('/public-panic', require('../controllers/checkInController').publicPanic);

router.use(protect, allowRoles('farmer'));

router.get('/active', getActiveSession);
router.get('/history', getHistory);
router.post('/', checkIn);
router.post('/panic', panic);
router.put('/:id/checkout', checkOut);
router.post('/:id/location', pingLocation);

module.exports = router;
