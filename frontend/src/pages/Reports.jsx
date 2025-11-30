import React, { useState } from 'react';
import API from '../api';

export default function Reports() {
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rows, setRows] = useState([]);

  const generate = () => {
    if (!startDate || !endDate) {
      alert('Select start and end date');
      return;
    }
    API.get('/api/attendance/all', {
      params: {
        employeeId: employeeId || undefined,
        startDate,
        endDate
      }
    })
      .then(res => setRows(res.data))
      .catch(() => {});
  };

  const exportCsv = async () => {
  if (!startDate || !endDate) {
    alert('Select start and end date');
    return;
  }

  try {
    const params = {
      startDate,
      endDate,
    };
    if (employeeId) params.employeeId = employeeId;

    
    const res = await API.get('/api/attendance/export', {
      params,
      responseType: 'blob',
    });

    
    const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `attendance_${startDate}_${endDate}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.msg || 'Export failed');
  }
};


  return (
    <div className="card">
      <h2 style={{ marginBottom: '14px' }}>Reports</h2>

      {/* FILTER SECTION */}
      <div className="filters" style={{ marginBottom: '16px' }}>
        <input
          placeholder="Employee ID (leave empty for all)"
          value={employeeId}
          onChange={e => setEmployeeId(e.target.value)}
        />

        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />

        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />

        <button onClick={generate}>Generate</button>

        <button onClick={exportCsv}>
          Export CSV
        </button>
      </div>

      {/* RESULTS TABLE */}
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
