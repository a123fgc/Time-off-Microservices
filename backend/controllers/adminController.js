const Leave = require('../models/Leave');
const User = require('../models/User');
const CompanyLeave = require('../models/CompanyLeave');
const Notification = require('../models/Notification');

const validRoles = ['user', 'admin'];

// @desc    Get all leave requests
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or reject leave request
exports.updateLeaveStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });

    if (status === 'Approved' && leave.status !== 'Approved') {
      const user = await User.findById(leave.userId);
      if (user && leave.type !== 'Company Leave') {
        user.leaveBalance = Number(user.leaveBalance || 0) - Number(leave.days || 0);
        await user.save();
      }
      await Notification.create({
        userId: leave.userId,
        title: 'Leave Approved',
        message: `Your request for ${leave.type} has been approved.`
      });
    } else if (status === 'Rejected') {
      await Notification.create({
        userId: leave.userId,
        title: 'Leave Rejected',
        message: `Your request for ${leave.type} has been rejected.`
      });
    }

    leave.status = status;
    await leave.save();
    res.json({ message: `Leave ${status} successfully`, leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add company-wide leave
exports.addCompanyLeave = async (req, res) => {
  const { title, date } = req.body;
  try {
    const companyLeave = await CompanyLeave.create({ title, date });
    const employees = await User.find({ role: 'user' });
    const notifications = employees.map(emp => ({
      userId: emp._id,
      title: 'New Company Holiday',
      message: `Admin has added: ${title} on ${new Date(date).toDateString()}.`
    }));
    await Notification.insertMany(notifications);
    res.status(201).json(companyLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update company leave
exports.updateCompanyLeave = async (req, res) => {
  const { title, date } = req.body;
  try {
    const leave = await CompanyLeave.findByIdAndUpdate(req.params.id, { title, date }, { new: true });
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete company leave
exports.deleteCompanyLeave = async (req, res) => {
  try {
    await CompanyLeave.findByIdAndDelete(req.params.id);
    res.json({ message: 'Holiday deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all company-wide leaves
exports.getCompanyLeaves = async (req, res) => {
  try {
    const companyLeaves = await CompanyLeave.find().sort({ date: 1 });
    res.json(companyLeaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send manual notification
exports.sendManualNotification = async (req, res) => {
  const { title, message, target } = req.body; // target: 'all' or specific userId
  try {
    if (target === 'all') {
      const users = await User.find();
      const notifications = users.map(u => ({ userId: u._id, title, message }));
      await Notification.insertMany(notifications);
    } else {
      await Notification.create({ userId: target, title, message });
    }
    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign leaves to all employees
exports.assignBulkLeaves = async (req, res) => {
  const { days } = req.body;
  try {
    await User.updateMany({ role: 'user' }, { $set: { leaveBalance: Number(days) } });
    res.json({ message: `Successfully assigned ${days} leaves.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin create user
// @route   POST /api/admin/users
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }

  const nextRole = (role || 'user').toLowerCase();
  if (!validRoles.includes(nextRole)) {
    return res.status(400).json({ message: 'role must be either user or admin' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role: nextRole });
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      leaveBalance: user.leaveBalance,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Admin assign role
// @route   PUT /api/admin/users/:id/role
exports.assignRole = async (req, res) => {
  const nextRole = String(req.body.role || '').toLowerCase();

  if (!validRoles.includes(nextRole)) {
    return res.status(400).json({ message: 'role must be either user or admin' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = nextRole;
    await user.save();

    return res.json({
      message: 'Role updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        leaveBalance: user.leaveBalance,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
