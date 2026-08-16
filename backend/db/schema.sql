-- ====================================================================
-- APEX DIGITAL OUTPASS MANAGEMENT SYSTEM — MySQL Schema
-- ====================================================================
-- Run against your MySQL instance (connect to correct DB first):
--   mysql -h HOST -P PORT -u USER -p DATABASE < backend/db/schema.sql
-- ====================================================================


-- ── Users Table ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'hod')),
    reg_no VARCHAR(50),
    department VARCHAR(100) NOT NULL,
    year VARCHAR(20),
    teacher_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Outpass Requests Table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS outpass_requests (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    reg_no VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year VARCHAR(20) NOT NULL,
    teacher_name VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    date DATE NOT NULL,
    out_time VARCHAR(20) NOT NULL,
    expected_return_time VARCHAR(20) NOT NULL,
    teacher_status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    hod_status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    teacher_comments TEXT,
    hod_comments TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    teacher_action_at TIMESTAMP NULL,
    hod_action_at TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES users(id),
    INDEX idx_outpass_student (student_id),
    INDEX idx_outpass_teacher_status (teacher_status),
    INDEX idx_outpass_hod_status (hod_status)
);

-- ====================================================================
-- SEED DATA — Sample users for testing
-- ====================================================================

-- Students
INSERT IGNORE INTO users (id, name, email, password, role, reg_no, department, year, teacher_name, avatar_url)
VALUES
  ('std_01', 'Arjun Kumar', 'arjun@apex.edu', 'password123', 'student', 'AITS2024001', 'Computer Science', '3rd Year', 'Prof. Meena Sharma', NULL),
  ('std_02', 'Priya Patel', 'priya@apex.edu', 'password123', 'student', 'AITS2024002', 'Electronics', '2nd Year', 'Prof. Rajesh Verma', NULL),
  ('std_03', 'Rahul Singh', 'rahul@apex.edu', 'password123', 'student', 'AITS2024003', 'Computer Science', '4th Year', 'Prof. Meena Sharma', NULL);

-- Teachers
INSERT IGNORE INTO users (id, name, email, password, role, reg_no, department, year, teacher_name, avatar_url)
VALUES
  ('tch_01', 'Prof. Meena Sharma', 'meena@apex.edu', 'password123', 'teacher', NULL, 'Computer Science', NULL, NULL, NULL),
  ('tch_02', 'Prof. Rajesh Verma', 'rajesh@apex.edu', 'password123', 'teacher', NULL, 'Electronics', NULL, NULL, NULL);

-- HOD
INSERT IGNORE INTO users (id, name, email, password, role, reg_no, department, year, teacher_name, avatar_url)
VALUES
  ('hod_01', 'Dr. Anand Gupta', 'anand@apex.edu', 'password123', 'hod', NULL, 'Computer Science', NULL, NULL, NULL);
