const express = require('express');
const router = express.Router();
const { handleUssd } = require('../controllers/ussdController');

// No auth middleware here — Africa's Talking calls this directly, and our own
// login/session logic inside the controller handles farmer identity via PIN.
router.post('/', handleUssd);

module.exports = router;
