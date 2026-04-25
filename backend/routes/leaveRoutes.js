const express = require('express');
const router = express.Router();
const { applyLeave, getMyLeaveHistory } = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, applyLeave);
router.get('/myhistory', protect, getMyLeaveHistory);

module.exports = router;
