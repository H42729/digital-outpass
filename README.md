# Apex Institute Digital Outpass Management System

A modern full-stack web application for managing campus outpasses with role-based workflows for **Students**, **Class Teachers**, and **Head of Department (HOD)**.

---

## 🌟 Key Features

- **3 Distinct Roles & Dashboards**:
  - **Student**: Apply for digital outpass with all required details, track live multi-stage approval status, download QR-coded digital gate pass.
  - **Class Teacher**: Review incoming student outpass requests, add optional remarks, approve to forward to HOD, or reject to notify student immediately.
  - **HOD**: Receive teacher-approved requests, review details, grant final approval or rejection with executive sign-off.
- **Workflow Pipeline**:
  ```
  [Student Submit Request]
              │
              ▼
  [Class Teacher Dashboard] ────► Reject ──► Status: "Rejected by Class Teacher"
              │ (Approve)
              ▼
       [HOD Dashboard]       ────► Reject ──► Status: "Rejected by HOD"
              │ (Approve)
              ▼
  Status: "Approved by HOD" (Digital Gate Pass Issued)
  ```
- **Real-Time Search & Filtering**: Filter by keyword (name, reg number, department, date) and status (Pending, Approved, Rejected).
- **Metric Summary Cards**: Total, Pending, Approved, and Rejected request statistics for each portal.
- **Color-Coded Status Badges**:
  - **Pending** (Yellow)
  - **Approved** (Green)
  - **Rejected** (Red)
- **Role-Based Access Control (RBAC)**: Strict route guards preventing unauthorized portal access.

---

## 🛠️ Tech Stack

| Layer    | Technology                        |
| :------- | :-------------------------------- |
| Frontend | React 19 + Vite + Bootstrap 5    |
| Backend  | Node.js + Express                |
| Database | MySQL (via mysql2/promise)        |

---

## 🗄️ Database Schema (`backend/db/schema.sql`)

### Users Table
```sql
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student', 'teacher', 'hod')) NOT NULL,
    reg_no VARCHAR(50),
    department VARCHAR(100) NOT NULL,
    year VARCHAR(20),
    teacher_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Outpass Requests Table
```sql
CREATE TABLE outpass_requests (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES users(id),
    student_name VARCHAR(100) NOT NULL,
    reg_no VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year VARCHAR(20) NOT NULL,
    teacher_name VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    date DATE NOT NULL,
    out_time VARCHAR(20) NOT NULL,
    expected_return_time VARCHAR(20) NOT NULL,
    teacher_status VARCHAR(20) DEFAULT 'Pending',
    hod_status VARCHAR(20) DEFAULT 'Pending',
    teacher_comments TEXT,
    hod_comments TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    teacher_action_at TIMESTAMP NULL,
    hod_action_at TIMESTAMP NULL
);
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & start session |
| `POST` | `/api/auth/logout` | Terminate active user session |
| `GET` | `/api/outpasses` | Fetch role-filtered outpass applications |
| `POST` | `/api/outpasses` | Submit a new outpass application (Student) |
| `PUT` | `/api/outpasses/:id/teacher-action` | Approve or Reject outpass (Class Teacher) |
| `PUT` | `/api/outpasses/:id/hod-action` | Approve or Reject outpass (HOD) |
| `GET` | `/api/health` | Health check |

---

## 🚀 How to Run Locally

### 1. Database Setup (MySQL)
```bash
# Login to MySQL and run the schema script
mysql -u root -p < backend/db/schema.sql
```
This creates the `outpass_db` database, tables, and seed data.

### 2. Backend (Node.js + Express)
```bash
cd backend
npm install
node server.js
```
The API server runs on `http://localhost:5000`.

### 3. Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on `http://localhost:5173`.

---

## 🔑 Test Credentials

| Role    | Email             | Password      |
| :------ | :---------------- | :------------ |
| Student | arjun@apex.edu    | password123   |
| Student | priya@apex.edu    | password123   |
| Teacher | meena@apex.edu    | password123   |
| Teacher | rajesh@apex.edu   | password123   |
| HOD     | anand@apex.edu    | password123   |
