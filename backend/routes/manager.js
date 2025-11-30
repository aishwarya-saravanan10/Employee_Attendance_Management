const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const createCsvWriter = require('csv-writer').createObjectCsvStringifier;
const moment = require('moment');

const ensureManager = (req, res, next) => {
  if (req.user.role !== 'manager') return res.status(403).json({ msg: 'Forbidden' });
  next();
};

// All attendance (filters: employeeId, date, status, month, startDate, endDate)
router.get('/all', auth, ensureManager, async (req, res) => {
  try {
    const { employeeId, date, status, month, startDate, endDate } = req.query;
    let userFilter = {};
    if (employeeId) userFilter.employeeId = employeeId;
    const users = await User.find(userFilter).select('_id name employeeId department');
    const userIds = users.map(u => u._id);
    const query = {};
    if (date) query.date = date;
    if (status) query.status = status;
    if (month) query.date = { $regex: `^${month}` };
    if (startDate && endDate) query.date = { $gte: startDate, $lte: endDate };
    if (userIds.length) query.userId = { $in: userIds };
    const list = await Attendance.find(query)
      .populate('userId', 'name employeeId department')
      .sort({ date: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Specific employee full history
router.get('/employee/:id', auth, ensureManager, async (req, res) => {
  try {
    const { id } = req.params;
    const list = await Attendance.find({ userId: id }).sort({ date: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Team summary (by status for a month)
router.get('/summary', auth, ensureManager, async (req, res) => {
  try {
    const { month } = req.query; // YYYY-MM
    const match = {};
    if (month) match.date = { $regex: `^${month}` };
    const agg = await Attendance.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json(agg);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Export CSV
router.get('/export', auth, ensureManager, async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    let userIds = [];
    if (employeeId) {
      const u = await User.findOne({ employeeId });
      if (u) userIds = [u._id];
    }
    const q = {};
    if (startDate && endDate) q.date = { $gte: startDate, $lte: endDate };
    if (userIds.length) q.userId = { $in: userIds };
    const rows = await Attendance.find(q)
      .populate('userId', 'name employeeId department')
      .sort({ date: -1 });

    const csvStringifier = createCsvWriter({
      header: [
        { id: 'employeeId', title: 'EmployeeId' },
        { id: 'name', title: 'Name' },
        { id: 'department', title: 'Department' },
        { id: 'date', title: 'Date' },
        { id: 'checkInTime', title: 'CheckIn' },
        { id: 'checkOutTime', title: 'CheckOut' },
        { id: 'status', title: 'Status' },
        { id: 'totalHours', title: 'TotalHours' }
      ]
    });
    const data = rows.map(r => ({
      employeeId: r.userId.employeeId,
      name: r.userId.name,
      department: r.userId.department || '',
      date: r.date,
      checkInTime: r.checkInTime ? r.checkInTime.toISOString() : '',
      checkOutTime: r.checkOutTime ? r.checkOutTime.toISOString() : '',
      status: r.status,
      totalHours: r.totalHours
    }));
    const header = csvStringifier.getHeaderString();
    const body = csvStringifier.stringifyRecords(data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance.csv');
    res.send(header + body);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Today's status - who's present today
router.get('/today-status', auth, ensureManager, async (req, res) => {
  try {
    const today = moment().format('YYYY-MM-DD');
    const rows = await Attendance.find({ date: today }).populate(
      'userId',
      'name employeeId department'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
