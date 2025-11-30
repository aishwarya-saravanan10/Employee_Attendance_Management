import React from 'react';
import API from '../api';

export default function MarkAttendance({ compact }) {
  const checkIn = async () => {
    try {
      await API.post('/api/attendance/checkin');
      alert('Checked in successfully');
    } catch (err) {
      alert(err.response?.data?.msg || 'Check-in failed');
    }
  };

  const checkOut = async () => {
    try {
      await API.post('/api/attendance/checkout');
      alert('Checked out successfully');
    } catch (err) {
      alert(err.response?.data?.msg || 'Check-out failed');
    }
  };

  const buttons = (
    <div style={{ display: 'flex', gap: '12px', marginTop: compact ? '6px' : '12px' }}>
      <button
        onClick={checkIn}
        style={{ flex: 1 }}
      >
        Check In
      </button>

      <button
        onClick={checkOut}
        style={{ flex: 1 }}
      >
        Check Out
      </button>
    </div>
  );

  if (compact)
    return (
      <div style={{ paddingTop: '6px' }}>
        {buttons}
      </div>
    );

  return (
    <div className="card">
      <h2 style={{ marginBottom: '14px' }}>Mark Attendance</h2>
      {buttons}
    </div>
  );
}
