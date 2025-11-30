import React, { useEffect, useState } from 'react';
import API from '../api';

function buildCalendar(month) {
  const [year, mon] = month.split('-').map(Number);
  const first = new Date(year, mon - 1, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, mon, 0).getDate();

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function MyHistory() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = () => {
    API.get('/api/attendance/my-history', { params: { month } })
      .then(res => setList(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, [month]);

  const map = {};
  list.forEach(a => {
    map[a.date] = a;
  });

  const cells = buildCalendar(month);

  const onClickDay = (day) => {
    if (!day) return;
    const dateStr = month + '-' + String(day).padStart(2, '0');
    setSelected(map[dateStr] || { date: dateStr, status: 'No record' });
  };

  const statusClass = (a) => {
    if (!a) return '';
    if (a.status === 'present') return 'day-present';
    if (a.status === 'absent') return 'day-absent';
    if (a.status === 'late') return 'day-late';
    if (a.status === 'half-day') return 'day-half';
    return '';
  };

  return (
    <div className="grid">

      {/* Left: Calendar */}
      <div className="card">
        <h2 style={{ marginBottom: '14px' }}>Attendance Calendar</h2>

        {/* MONTH SELECTOR */}
        <label style={{ marginBottom: '6px' }}>Select Month</label>
        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          style={{ maxWidth: '180px' }}
        />

        {/* CALENDAR UI */}
        <div className="calendar" style={{ marginTop: '14px' }}>
          <div className="cal-header">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span>
            <span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          <div className="cal-body">
            {cells.map((d, idx) => {
              const dateStr = d ? month + '-' + String(d).padStart(2, '0') : null;
              const att = dateStr ? map[dateStr] : null;

              return (
                <div
                  key={idx}
                  className={`cal-cell ${d ? 'cal-day' : ''} ${att ? statusClass(att) : ''}`}
                  onClick={() => onClickDay(d)}
                  style={{ cursor: d ? 'pointer' : 'default' }}
                >
                  {d || ''}
                </div>
              );
            })}
          </div>

          <div className="legend" style={{ marginTop: '16px' }}>
            <span className="legend-box day-present" /> Present
            <span className="legend-box day-absent" /> Absent
            <span className="legend-box day-late" /> Late
            <span className="legend-box day-half" /> Half-day
          </div>
        </div>
      </div>

      {/* Right: Details Panel */}
      <div className="card">
        <h2 style={{ marginBottom: '14px' }}>Details</h2>

        {selected ? (
          <div style={{ lineHeight: '1.6' }}>
            <p><strong>Date:</strong> {selected.date}</p>
            <p><strong>Status:</strong> {selected.status}</p>
            <p><strong>Check In:</strong> {selected.checkInTime ? new Date(selected.checkInTime).toLocaleTimeString() : '-'}</p>
            <p><strong>Check Out:</strong> {selected.checkOutTime ? new Date(selected.checkOutTime).toLocaleTimeString() : '-'}</p>
            <p><strong>Total Hours:</strong> {selected.totalHours || '-'}</p>
          </div>
        ) : (
          <p>Select a date from the calendar.</p>
        )}

        {/* RAW TABLE */}
        <h3 className="mt" style={{ marginTop: '20px' }}>Raw Table</h3>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            {list.map(r => (
              <tr key={r._id}>
                <td>{r.date}</td>
                <td>{r.status}</td>
                <td>{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : '-'}</td>
                <td>{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : '-'}</td>
                <td>{r.totalHours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
