const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const moment = require('moment');

// Employee: Check-in
router.post('/checkin', auth, async (req, res) => {
  try {
    const user = req.user;
    const today = moment().format('YYYY-MM-DD');
    let att = await Attendance.findOne({ userId: user._id, date: today });
    if (att && att.checkInTime) return res.status(400).json({ msg: 'Already checked in' });
    const now = new Date();
    const hour = now.getHours();
    const status = hour > 9 ? 'late' : 'present';

    if (!att) {
      att = new Attendance({
        userId: user._id,
        date: today,
        checkInTime: now,
        status
      });
    } else {
      att.checkInTime = now;
      att.status = status;
    }
    await att.save();
    res.json(att);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Employee: Check-out
router.post('/checkout', auth, async (req, res) => {
  try {
    const user = req.user;
    const today = moment().format('YYYY-MM-DD');
    let att = await Attendance.findOne({ userId: user._id, date: today });
    if (!att || !att.checkInTime)
      return res.status(400).json({ msg: 'You have not checked in' });
    if (att.checkOutTime) return res.status(400).json({ msg: 'Already checked out' });

    const now = new Date();
    att.checkOutTime = now;
    const hours = (att.checkOutTime - att.checkInTime) / (1000 * 60 * 60);
    att.totalHours = Math.round(hours * 100) / 100;
    await att.save();
    res.json(att);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Employee: My history
router.get('/my-history', auth, async (req, res) => {
  try {
    const user = req.user;
    const { month } = req.query; // YYYY-MM optional
    const query = { userId: user._id };
    if (month) query.date = { $regex: `^${month}` };
    const list = await Attendance.find(query).sort({ date: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Employee: My summary (monthly)
router.get('/my-summary', auth, async (req, res) => {
  try {
    const user = req.user;
    const { month } = req.query; // e.g., 2025-11
    const match = { userId: user._id };
    if (month) match.date = { $regex: `^${month}` };
    const list = await Attendance.find(match);
    const summary = { present: 0, absent: 0, late: 0, halfDay: 0, totalHours: 0 };
    list.forEach(a => {
      if (a.status === 'late') summary.late += 1;
      else if (a.status === 'half-day') summary.halfDay += 1;
      else if (a.status === 'absent') summary.absent += 1;
      else summary.present += 1;
      summary.totalHours += a.totalHours || 0;
    });
    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Employee: Today's status
router.get('/today', auth, async (req, res) => {
  try {
    const user = req.user;
    const today = moment().format('YYYY-MM-DD');
    const att = await Attendance.findOne({ userId: user._id, date: today });
    res.json(att || null);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
