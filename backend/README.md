# Attendance Backend (Complete)

## Setup
1. Copy `.env.example` to `.env` and fill:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT` (optional, default 5000)
2. Install:
   ```bash
   cd backend
   npm install
   ```
3. Seed sample data:
   ```bash
   npm run seed
   ```
4. Run:
   ```bash
   npm run dev   # or npm start
   ```

## Main Endpoints

- Auth:
  - POST `/api/auth/register`
  - POST `/api/auth/login`
  - GET `/api/auth/me`

- Employee Attendance:
  - POST `/api/attendance/checkin`
  - POST `/api/attendance/checkout`
  - GET `/api/attendance/my-history?month=YYYY-MM`
  - GET `/api/attendance/my-summary?month=YYYY-MM`
  - GET `/api/attendance/today`

- Manager Attendance:
  - GET `/api/attendance/all?employeeId=EMP001&date=YYYY-MM-DD&status=present&month=YYYY-MM&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
  - GET `/api/attendance/employee/:id`
  - GET `/api/attendance/summary?month=YYYY-MM`
  - GET `/api/attendance/export?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&employeeId=EMP001`
  - GET `/api/attendance/today-status`

- Dashboard:
  - GET `/api/dashboard/employee`
  - GET `/api/dashboard/manager`
