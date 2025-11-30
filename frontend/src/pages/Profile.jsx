import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Profile() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    API.get('/api/auth/me')
      .then(res => setMe(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="card">
      <h2 style={{ marginBottom: '16px' }}>My Profile</h2>

      {!me && <p>Loading...</p>}

      {me && (
        <div style={{ lineHeight: '1.8' }}>
          <div className="profile-grid">

            <div>
              <strong>Name:</strong>
              <div>{me.name}</div>
            </div>

            <div>
              <strong>Email:</strong>
              <div>{me.email}</div>
            </div>

            <div>
              <strong>Role:</strong>
              <div style={{ textTransform: 'capitalize' }}>
                {me.role}
              </div>
            </div>

            <div>
              <strong>Employee ID:</strong>
              <div>{me.employeeId}</div>
            </div>

            <div>
              <strong>Department:</strong>
              <div>{me.department || '-'}</div>
            </div>

            <div>
              <strong>Joined On:</strong>
              <div>{new Date(me.createdAt).toLocaleString()}</div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
