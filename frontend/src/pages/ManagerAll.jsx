import React, { useEffect, useState } from 'react';
import API from '../api';

export default function ManagerAll() {
  const [rows, setRows] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');

  const load = () => {
    API.get('/api/attendance/all', {
      params: {
        employeeId: employeeId || undefined,
        date: date || undefined,
        status: status || undefined
      }
    })
      .then(res => setRows(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="card">
      <h2 style={{ marginBottom: '14px' }}>All Employees Attendance</h2>

      {/* FILTERS */}
      <div className="filters" style={{ marginBottom: '16px' }}>
        <input
          placeholder="Employee ID (EMP001)"
          value={employeeId}
          onChange={e => setEmployeeId(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
          <option value="half-day">Half-day</option>
        </select>

        <button onClick={load}>
          Filter
        </button>
      </div>

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Dept</th>
            <th>Status</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Hours</th>
          </tr>
        </thead>

        <tbody>
          {rows.map(r => (
            <tr key={r._id}>
              <td>{r.date}</td>
              <td>{r.userId?.employeeId}</td>
              <td>{r.userId?.name}</td>
              <td>{r.userId?.department}</td>
              <td>{r.status}</td>
              <td>{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : '-'}</td>
              <td>{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : '-'}</td>
              <td>{r.totalHours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
