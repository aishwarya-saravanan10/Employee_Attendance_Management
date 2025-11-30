import React, { useEffect, useState } from 'react';
import API from '../api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';

export default function ManagerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get('/api/dashboard/manager')
      .then(res => setData(res.data))
      .catch(() => {});
  }, []);

  if (!data)
    return (
      <div className="card">
        <h2 style={{ marginBottom: '10px' }}>Manager Dashboard</h2>
        <p>Loading...</p>
      </div>
    );

  const { totalEmployees, today, weeklyTrend, departmentWise, absentEmployeesToday } = data;

  return (
    <div className="grid">

      {/* OVERVIEW */}
      <div className="card">
        <h2 style={{ marginBottom: '14px' }}>Overview</h2>

        <div className="stats-row">
          <div className="stat-box">
            <span>Total Employees</span>
            <strong>{totalEmployees}</strong>
          </div>

          <div className="stat-box green">
            <span>Present Today</span>
            <strong>{today.present}</strong>
          </div>

          <div className="stat-box red">
            <span>Absent Today</span>
            <strong>{today.absent}</strong>
          </div>

          <div className="stat-box yellow">
            <span>Late Today</span>
            <strong>{today.late}</strong>
          </div>
        </div>
      </div>

      {/* WEEKLY TREND CHART */}
      <div className="card">
        <h2 style={{ marginBottom: '14px' }}>Weekly Attendance Trend</h2>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={weeklyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="present" name="Present" />
            <Line type="monotone" dataKey="absent" name="Absent" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* DEPARTMENT WISE CHART */}
      <div className="card">
        <h2 style={{ marginBottom: '14px' }}>Department-wise Attendance (This Month)</h2>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={departmentWise}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="present" name="Present Days" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ABSENT EMPLOYEES TABLE */}
      <div className="card">
        <h2 style={{ marginBottom: '14px' }}>Absent Employees Today</h2>

        {absentEmployeesToday.length === 0 && (
          <p>Everyone is present today.</p>
        )}

        {absentEmployeesToday.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {absentEmployeesToday.map(e => (
                <tr key={e._id}>
                  <td>{e.employeeId}</td>
                  <td>{e.name}</td>
                  <td>{e.department || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
