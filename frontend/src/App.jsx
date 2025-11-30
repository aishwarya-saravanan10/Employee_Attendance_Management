import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import MarkAttendance from './pages/MarkAttendance';
import MyHistory from './pages/MyHistory';
import Profile from './pages/Profile';
import ManagerDashboard from './pages/ManagerDashboard';
import ManagerAll from './pages/ManagerAll';
import TeamCalendar from './pages/TeamCalendar';
import Reports from './pages/Reports';
import { logout } from './store/authSlice';

const ProtectedRoute = ({ children, roles }) => {
  const { user, token } = useSelector(s => s.auth);
  if (!token || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();

  return (
    <div className="app">

      {/* NEW NAVBAR */}
      <nav className="nav">
        <div className="nav-left">
          <span className="brand">
            Employee Attendance Management System
          </span>

          {user && (
            <>
              <Link className="nav-link" to="/dashboard">Dashboard</Link>

              {user.role === 'employee' && (
                <>
                  <Link className="nav-link" to="/mark">Mark Attendance</Link>
                  <Link className="nav-link" to="/history">My History</Link>
                  <Link className="nav-link" to="/profile">Profile</Link>
                </>
              )}

              {user.role === 'manager' && (
                <>
                  <Link className="nav-link" to="/manager/dashboard">Manager Dashboard</Link>
                  <Link className="nav-link" to="/manager/all">All Attendance</Link>
                  <Link className="nav-link" to="/manager/calendar">Team Calendar</Link>
                  <Link className="nav-link" to="/manager/reports">Reports</Link>
                </>
              )}
            </>
          )}
        </div>

        <div className="nav-right">
          {!user && (
            <>
              <Link className="nav-btn" to="/login">Login</Link>
              <Link className="nav-btn nav-light" to="/register">Register</Link>
            </>
          )}

          {user && (
            <>
              <span className="user-label">{user.name} ({user.role})</span>
              <button className="logout-btn" onClick={() => dispatch(logout())}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['employee', 'manager']}>
                {user?.role === 'manager'
                  ? <ManagerDashboard />
                  : <EmployeeDashboard />}
              </ProtectedRoute>
            }
          />

          <Route
            path="/mark"
            element={
              <ProtectedRoute roles={['employee']}>
                <MarkAttendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute roles={['employee']}>
                <MyHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={['employee','manager']}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute roles={['manager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/all"
            element={
              <ProtectedRoute roles={['manager']}>
                <ManagerAll />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/calendar"
            element={
              <ProtectedRoute roles={['manager']}>
                <TeamCalendar />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/reports"
            element={
              <ProtectedRoute roles={['manager']}>
                <Reports />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
