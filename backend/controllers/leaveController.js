const Leave = require('../models/Leave');
const User = require('../models/User');

// @desc    Apply for leave
// @route   POST /api/leaves
exports.applyLeave = async (req, res) => {
  const { type, days, startDate, endDate, reason } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (type === 'Annual Leave' || type === 'Sick Leave') {
      if (user.leaveBalance < days) {
        return res.status(400).json({ message: 'Insufficient leave balance' });
      }
      
      // Create pending request
      const leave = await Leave.create({
        userId: req.user._id,
        type,
        days,
        startDate,
        endDate,
        reason,
        status: 'Pending'
      });

      res.status(201).json(leave);
    } else if (type === 'Company Leave') {
      // Auto-approve company leave
      const leave = await Leave.create({
        userId: req.user._id,
        type,
        days,
        startDate,
        endDate,
        reason,
        status: 'Approved'
      });

      res.status(201).json(leave);
    } else {
      res.status(400).json({ message: 'Invalid leave type' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's leave history
// @route   GET /api/leaves/myhistory
exports.getMyLeaveHistory = async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
