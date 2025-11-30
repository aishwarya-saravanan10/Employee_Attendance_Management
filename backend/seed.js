const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const bcrypt = require('bcryptjs');

dotenv.config();

async function seed() {
  try {
    await connectDB();
    await User.deleteMany({});
    await Attendance.deleteMany({});

    const users = [
      {
        name: 'Aishwarya',
        email: 'aishwarya@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'manager',
        employeeId: 'MGR001',
        department: 'Engineering'
      },
      {
        name: 'Dharaneeswar',
        email: 'dhara@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'employee',
        employeeId: 'EMP001',
        department: 'Engineering'
      },
      {
        name: 'Employee Two',
        email: 'emp2@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'employee',
        employeeId: 'EMP002',
        department: 'Design'
      }
    ];

    const created = await User.insertMany(users);
    console.log('Users created:', created.length);

    const today = new Date();
    const att = [];

    for (let i = 1; i <= 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);

      for (const u of created) {
        if (u.role === 'employee') {
          const checkIn = new Date(d);
          checkIn.setHours(9 + (i % 3 === 0 ? 1 : 0), 0, 0); // some late days
          const checkOut = new Date(d);
          checkOut.setHours(17, 30, 0);
          const status = i % 5 === 0 ? 'absent' : (checkIn.getHours() > 9 ? 'late' : 'present');
          const totalHours = status === 'absent' ? 0 : 8.5;
          att.push({
            userId: u._id,
            date: dateStr,
            checkInTime: status === 'absent' ? null : checkIn,
            checkOutTime: status === 'absent' ? null : checkOut,
            status,
            totalHours
          });
        }
      }
    }

    await Attendance.insertMany(att);
    console.log('Attendance seeded:', att.length);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
