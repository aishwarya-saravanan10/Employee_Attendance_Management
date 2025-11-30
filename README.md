# Attendance Management System

A full‑stack Attendance Tracking System built for college project submission.
Includes Employee & Manager roles, dashboards, reports, calendar views, and modern SaaS UI.


## ** College Details**
**College Name:** Hindusthan Institute of Technology, Coimbatore.
**Student Name:** AISHWARYA SARAVANAN  
**Register Number:** 720822103010
**Phone:** 6382263373


## ** Screenshots**

- Login Page  
  C:\Users\sarav\OneDrive\Desktop\Attendance_system_fullstack\screenshots\Login Page.jpg

- Register Page  
  C:\Users\sarav\OneDrive\Desktop\Attendance_system_fullstack\screenshots\Register Page.jpg

- Employee Dashboard  
  C:\Users\sarav\OneDrive\Desktop\Attendance_system_fullstack\screenshots\Emplyee Dashboard.jpg

- Manager Dashboard 
  C:\Users\sarav\OneDrive\Desktop\Attendance_system_fullstack\screenshots\Manager Dashboard.jpg

- Attendance Marking 
  C:\Users\sarav\OneDrive\Desktop\Attendance_system_fullstack\screenshots\Mark Attendance.jpg

- History Calendar View 
  C:\Users\sarav\OneDrive\Desktop\Attendance_system_fullstack\screenshots\Attendance Calender.jpg


- Reports Page
  C:\Users\sarav\OneDrive\Desktop\Attendance_system_fullstack\screenshots\Reports.jpg

- Profile
  C:\Users\sarav\OneDrive\Desktop\Attendance_system_fullstack\screenshots\Profile.jpg


## ** Tech Stack**
### **Frontend**
- React.js
- Redux Toolkit
- Vite
- Lucide Icons
- Custom CSS (SaaS UI Design)

### **Backend**
- Node.js + Express.js
- JWT Authentication
- Bcrypt Password Hashing

### **Database**
- MongoDB Atlas (Cloud DB)


## ** Project Structure**

attendance_System/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── styles.css
│   │   └── main.jsx
│   └── index.html
└── README.md



## ** How to Run the Project**
### ** Clone the Repository**

git clone <your-repo-link>
cd attendance_System


## ** Backend Setup**
Go to the backend folder:

cd backend
npm install


Run backend:

npm run dev

Backend runs on:  
 http://localhost:5000


## ** Frontend Setup**
Go to the frontend folder:

cd frontend
npm install
npm run dev

Frontend runs on:  
 http://127.0.0.1:5173/


## ** Default Login Credentials (Seed Data)**
### **Manager**

Email: aishwarya@example.com
Password: password123

### **Employee**

Email: dhara@example.com
Password: password123



## ** Features**

### **Employee**
- Login / Register
- Check In / Check Out
- View History (Calendar + Table)
- Monthly summary
- Dashboard with stats

### **Manager**
- View all employee attendance
- Filter by date / employee / status
- Calendar overview
- Export CSV reports
- Dashboard with charts


## ** API Endpoints Overview**
### **Auth**
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

### **Employee Attendance**
- POST `/api/attendance/checkin`
- POST `/api/attendance/checkout`
- GET `/api/attendance/my-history`
- GET `/api/attendance/my-summary`

### **Manager Attendance**
- GET `/api/attendance/all`
- GET `/api/attendance/summary`
- GET `/api/attendance/export`


## ** Conclusion**
This project implements a complete Attendance Management System suitable for official college submission.
Includes:
- Fully functional backend
- Modern SaaS UI frontend
- Role‑based access
- Downloadable reports
- Clean code structure

## **✍️ Submitted By:**
**Name:** AISHWARYA SARAVANAN 
**Reg No:** 720822103010
**Dept:** BE CSE  
**College:** Hindusthan Institute of Technology


