# Attendance Frontend (Complete)

## Setup

```bash
cd frontend
npm install
npm run dev
```

By default it expects the backend at `http://localhost:5000`.

To change, create `.env` in `frontend`:

```env
VITE_API_URL=http://localhost:5000
```

## Main Pages

- Employee:
  - Login / Register
  - Dashboard (today status, monthly summary, total hours, last 7 days, quick check-in/out)
  - Mark Attendance
  - My Attendance History (calendar + table + month filter)
  - Profile

- Manager:
  - Login (same login form, but manager user)
  - Manager Dashboard (stats + weekly chart + department-wise chart + absent list)
  - All Employees Attendance (filters: employee, date, status)
  - Team Calendar View (employee-wise monthly calendar)
  - Reports (date range, employee/all, table + CSV export)
