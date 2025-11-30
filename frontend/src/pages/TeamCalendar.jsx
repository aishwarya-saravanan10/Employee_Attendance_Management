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

export default function TeamCalendar() {
  const [employeeId, setEmployeeId] = useState('EMP001');
  const [month, setMonth] = useState(new Date().toISOString().slice(0,7));
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = () => {
    API.get('/api/attendance/all', {
      params: { employeeId, month }
    })
      .then(res => setRows(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, [employeeId, month]);

  const map = {};
  rows.forEach(r => { map[r.date] = r; });

  const cells = buildCalendar(month);

  const onClickDay = (d) => {
    if (!d) return;
    const dateStr = month + '-' + String(d).padStart(2, '0');
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

      {/* LEFT CARD — TEAM CALENDAR */}
      <div className="card">
        <h2 style={{ marginBottom: '14px' }}>Team Calendar View</h2>

        {/* FILTERS */}
        <div className="filters" style={{ marginBottom: '16px' }}>
          <input
            placeholder="Employee ID (EMP001)"
            value={employeeId}
            onChange={e => setEmployeeId(e.target.value)}
          />
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
          />
          <button onClick={load}>Load</button>
        </div>

        {/* CALENDAR */}
        <div className="calendar">
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

      {/* RIGHT CARD — DETAILS */}
      <div className="card">
        <h2 style={{ marginBottom: '14px' }}>Details</h2>

        {selected ? (
          <div style={{ lineHeight: '1.7' }}>
            <p><strong>Date:</strong> {selected.date}</p>
            <p><strong>Status:</strong> {selected.status}</p>
            <p><strong>Check In:</strong> {selected.checkInTime ? new Date(selected.checkInTime).toLocaleTimeString() : '-'}</p>
            <p><strong>Check Out:</strong> {selected.checkOutTime ? new Date(selected.checkOutTime).toLocaleTimeString() : '-'}</p>
            <p><strong>Total Hours:</strong> {selected.totalHours || '-'}</p>
          </div>
        ) : (
          <p>Select a date from the calendar.</p>
        )}
      </div>

    </div>
  );
}
