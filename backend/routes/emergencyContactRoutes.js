const express = require('express');
const router = express.Router();
const { getMyContacts, setContacts } = require('../controllers/emergencyContactController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

router.use(protect, allowRoles('farmer'));

router.get('/', getMyContacts);
router.put('/', setContacts);

module.exports = router;
