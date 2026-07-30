const express = require('express');
const router = express.Router();
const { registerFarmer, login, changePin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerFarmer);
router.post('/login', login);
router.post('/change-pin', protect, changePin);

module.exports = router;
