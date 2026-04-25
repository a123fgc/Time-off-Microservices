const express = require('express');
const router = express.Router();
const { 
  getAllLeaves, 
  updateLeaveStatus, 
  addCompanyLeave, 
  getCompanyLeaves, 
  assignBulkLeaves,
  updateCompanyLeave,
  deleteCompanyLeave,
  sendManualNotification,
  createUser,
  assignRole
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/users', protect, admin, createUser);
router.put('/users/:id/role', protect, admin, assignRole);
router.get('/leaves', protect, admin, getAllLeaves);
router.put('/leaves/:id', protect, admin, updateLeaveStatus);
router.post('/company-leaves', protect, admin, addCompanyLeave);
router.get('/company-leaves', protect, admin, getCompanyLeaves);
router.put('/company-leaves/:id', protect, admin, updateCompanyLeave);
router.delete('/company-leaves/:id', protect, admin, deleteCompanyLeave);
router.post('/assign-all', protect, admin, assignBulkLeaves);
router.post('/notifications', protect, admin, sendManualNotification);

module.exports = router;
