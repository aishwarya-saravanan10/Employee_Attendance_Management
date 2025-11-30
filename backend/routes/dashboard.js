const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const moment = require('moment');

// Employee Dashboard
router.get('/employee', auth, async (req, res) => {
  try {
    const user = req.user;
    const todayStr = moment().format('YYYY-MM-DD');
    const monthStr = moment().format('YYYY-MM');

    const today = await Attendance.findOne({ userId: user._id, date: todayStr });

    const list = await Attendance.find({
      userId: user._id,
      date: { $regex: `^${monthStr}` }
    }).sort({ date: -1 });

    const summary = { present: 0, absent: 0, late: 0, halfDay: 0, totalHours: 0 };
    list.forEach(a => {
      if (a.status === 'late') summary.late += 1;
      else if (a.status === 'half-day') summary.halfDay += 1;
      else if (a.status === 'absent') summary.absent += 1;
      else summary.present += 1;
      summary.totalHours += a.totalHours || 0;
    });

    const recent = await Attendance.find({ userId: user._id })
      .sort({ date: -1 })
      .limit(7);

    res.json({
      today,
      summary,
      totalHoursThisMonth: summary.totalHours,
      recent
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Manager Dashboard
router.get('/manager', auth, async (req, res) => {
  try {
    if (req.user.role !== 'manager')
      return res.status(403).json({ msg: 'Forbidden' });

    const todayStr = moment().format('YYYY-MM-DD');
    const weekAgoStr = moment().subtract(6, 'days').format('YYYY-MM-DD');
    const monthStr = moment().format('YYYY-MM');

    const totalEmployees = await User.countDocuments({ role: 'employee' });

    const todayAttendance = await Attendance.find({ date: todayStr }).populate(
      'userId',
      'department'
    );
    const presentCount = todayAttendance.filter(a => a.checkInTime).length;
    const lateCount = todayAttendance.filter(a => a.status === 'late').length;
    const absentCount = totalEmployees - presentCount;

    // weekly trend
    const weeklyRaw = await Attendance.find({
      date: { $gte: weekAgoStr, $lte: todayStr }
    });
    const weeklyMap = {};
    weeklyRaw.forEach(a => {
      if (!weeklyMap[a.date]) weeklyMap[a.date] = { present: 0, absent: 0 };
      if (a.checkInTime) weeklyMap[a.date].present += 1;
    });
    // compute absent per day as totalEmployees - present
    Object.keys(weeklyMap).forEach(d => {
      weeklyMap[d].absent = totalEmployees - weeklyMap[d].present;
    });
    const weeklyTrend = Object.keys(weeklyMap)
      .sort()
      .map(d => ({ date: d, ...weeklyMap[d] }));

    // department-wise attendance (this month present counts)
    const monthAttendance = await Attendance.find({
      date: { $regex: `^${monthStr}` }
    }).populate('userId', 'department');
    const deptMap = {};
    monthAttendance.forEach(a => {
      const dept = a.userId?.department || 'Unknown';
      if (!deptMap[dept]) deptMap[dept] = 0;
      if (a.checkInTime) deptMap[dept] += 1;
    });
    const departmentWise = Object.keys(deptMap).map(d => ({
      department: d,
      present: deptMap[d]
    }));

    // absent employees today
    const allEmployees = await User.find({ role: 'employee' }).select(
      'name employeeId department'
    );
    const presentIds = new Set(
      todayAttendance.filter(a => a.checkInTime).map(a => String(a.userId._id))
    );
    const absentEmployeesToday = allEmployees.filter(
      e => !presentIds.has(String(e._id))
    );

    res.json({
      totalEmployees,
      today: {
        present: presentCount,
        absent: absentCount,
        late: lateCount
      },
      weeklyTrend,
      departmentWise,
      absentEmployeesToday
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
