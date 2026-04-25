const mongoose = require('mongoose');

const companyLeaveSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CompanyLeave', companyLeaveSchema);
