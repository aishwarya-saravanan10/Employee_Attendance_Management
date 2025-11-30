import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('');
  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await API.post('/api/auth/register', {
        name,
        email,
        password,
        employeeId,
        department
      });
      alert('Registered successfully. Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="auth-card">
      <h2 style={{ textAlign: 'center', marginBottom: '22px' }}>Register</h2>

      <form onSubmit={onSubmit}>

        <label>Name</label>
        <input
          type="text"
          placeholder="Enter full name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <label>Employee ID</label>
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={employeeId}
          onChange={e => setEmployeeId(e.target.value)}
          required
        />

        <label>Department</label>
        <input
          type="text"
          placeholder="Enter department name"
          value={department}
          onChange={e => setDepartment(e.target.value)}
          required
        />

        <button
          type="submit"
          style={{ width: '100%', marginTop: '20px' }}
        >
          Register
        </button>
      </form>
    </div>
  );
}
