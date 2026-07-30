const express = require('express');
const router = express.Router();
const { getMyFarms, createFarm, updateFarm, deleteFarm } = require('../controllers/farmController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

router.use(protect, allowRoles('farmer'));

router.get('/', getMyFarms);
router.post('/', createFarm);
router.put('/:id', updateFarm);
router.delete('/:id', deleteFarm);

module.exports = router;
