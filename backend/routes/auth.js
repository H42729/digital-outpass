// ====================================================================
// Auth Routes — POST /api/auth/login, POST /api/auth/logout, Signup, Profile
// ====================================================================

import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// Fallback seed accounts for serverless environments (e.g. Vercel) when MySQL is disconnected
const inMemoryUsers = [
  { id: 'std_01', name: 'Arjun Kumar', email: 'arjun@apex.edu', password: 'password123', role: 'student', reg_no: 'AITS2024001', department: 'Computer Science', year: '3rd Year', teacher_name: 'Prof. Meena Sharma', avatar_url: null },
  { id: 'std_02', name: 'Priya Patel', email: 'priya@apex.edu', password: 'password123', role: 'student', reg_no: 'AITS2024002', department: 'Electronics', year: '2nd Year', teacher_name: 'Prof. Rajesh Verma', avatar_url: null },
  { id: 'std_03', name: 'Rahul Singh', email: 'rahul@apex.edu', password: 'password123', role: 'student', reg_no: 'AITS2024003', department: 'Computer Science', year: '4th Year', teacher_name: 'Prof. Meena Sharma', avatar_url: null },
  { id: 'tch_01', name: 'Prof. Meena Sharma', email: 'meena@apex.edu', password: 'password123', role: 'teacher', reg_no: null, department: 'Computer Science', year: null, teacher_name: null, avatar_url: null },
  { id: 'tch_02', name: 'Prof. Rajesh Verma', email: 'rajesh@apex.edu', password: 'password123', role: 'teacher', reg_no: null, department: 'Electronics', year: null, teacher_name: null, avatar_url: null },
  { id: 'hod_01', name: 'Dr. Anand Gupta', email: 'anand@apex.edu', password: 'password123', role: 'hod', reg_no: null, department: 'Computer Science', year: null, teacher_name: null, avatar_url: null },
];

/**
 * POST /api/auth/login
 * Authenticates a user by email + password (+ optional role).
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
        user: null,
      });
    }

    let user = null;

    try {
      let sql;
      let params;
      if (role && role.trim()) {
        sql = 'SELECT * FROM users WHERE (LOWER(email) = LOWER(?) OR LOWER(reg_no) = LOWER(?)) AND password = ? AND role = ? LIMIT 1';
        params = [email, email, password, role];
      } else {
        sql = 'SELECT * FROM users WHERE (LOWER(email) = LOWER(?) OR LOWER(reg_no) = LOWER(?)) AND password = ? LIMIT 1';
        params = [email, email, password];
      }
      const [rows] = await pool.execute(sql, params);
      if (rows && rows.length > 0) {
        user = rows[0];
      }
    } catch (dbErr) {
      console.warn('MySQL unavailable, using fallback in-memory authentication:', dbErr.message);
      user = inMemoryUsers.find(u =>
        (u.email.toLowerCase() === email.toLowerCase() || (u.reg_no && u.reg_no.toLowerCase() === email.toLowerCase())) &&
        u.password === password &&
        (!role || !role.trim() || u.role === role)
      );
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or role mismatch.',
        user: null,
      });
    }

    const userDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      regNo: user.reg_no || user.regNo,
      department: user.department,
      year: user.year,
      teacherName: user.teacher_name || user.teacherName,
      avatarUrl: user.avatar_url || user.avatarUrl,
    };

    return res.json({
      success: true,
      message: `Logged in successfully as ${user.name}`,
      user: userDto,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + (err.message || 'Internal error'),
      user: null,
    });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (_req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
});

/**
 * POST /api/auth/verify-email
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      });
    }

    let foundUser = null;
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, email FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1',
        [email]
      );
      if (rows && rows.length > 0) foundUser = rows[0];
    } catch (dbErr) {
      foundUser = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.',
      });
    }

    return res.json({
      success: true,
      message: 'Email verified successfully.',
      name: foundUser.name,
    });
  } catch (err) {
    console.error('Verify email error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + (err.message || 'Internal error'),
    });
  }
});

/**
 * POST /api/auth/reset-password
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email and new password are required.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    let userFound = false;

    try {
      const [existing] = await pool.execute(
        'SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1',
        [email]
      );
      if (existing && existing.length > 0) {
        userFound = true;
        await pool.execute(
          'UPDATE users SET password = ? WHERE LOWER(email) = LOWER(?)',
          [newPassword, email]
        );
      }
    } catch (dbErr) {
      const idx = inMemoryUsers.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      if (idx !== -1) {
        userFound = true;
        inMemoryUsers[idx].password = newPassword;
      }
    }

    if (!userFound) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.',
      });
    }

    return res.json({
      success: true,
      message: 'Password has been reset successfully.',
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + (err.message || 'Internal error'),
    });
  }
});

/**
 * POST /api/auth/signup
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, regNo, department, year, teacherName } = req.body;

    if (!name || !email || !password || !confirmPassword || !role || !department) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, role, and department are required.',
      });
    }

    const allowedRoles = ['student', 'teacher', 'hod'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    if (role === 'student' && (!regNo || !year || !teacherName)) {
      return res.status(400).json({
        success: false,
        message: 'Students must provide Registration Number, Year, and Class Teacher Name.',
      });
    }

    const { v4: uuidv4 } = await import('uuid');
    const prefix = role === 'student' ? 'std' : role === 'teacher' ? 'tch' : 'hod';
    const newId = `${prefix}_${uuidv4().slice(0, 8)}`;

    let savedUser = null;

    try {
      const [emailRows] = await pool.execute(
        'SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1',
        [email]
      );
      if (emailRows.length > 0) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      }

      await pool.execute(
        `INSERT INTO users (id, name, email, password, role, reg_no, department, year, teacher_name, avatar_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
        [
          newId,
          name.trim(),
          email.trim().toLowerCase(),
          password,
          role,
          role === 'student' ? (regNo?.trim() || null) : null,
          department.trim(),
          role === 'student' ? (year?.trim() || null) : null,
          role === 'student' ? (teacherName?.trim() || null) : null,
        ]
      );
    } catch (dbErr) {
      console.warn('MySQL insert unavailable, saving to in-memory store:', dbErr.message);
      if (inMemoryUsers.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      }
    }

    const newUserObj = {
      id: newId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      reg_no: role === 'student' ? (regNo?.trim() || null) : null,
      regNo: role === 'student' ? (regNo?.trim() || null) : null,
      department: department.trim(),
      year: role === 'student' ? (year?.trim() || null) : null,
      teacher_name: role === 'student' ? (teacherName?.trim() || null) : null,
      teacherName: role === 'student' ? (teacherName?.trim() || null) : null,
      avatar_url: null,
      avatarUrl: null,
    };

    inMemoryUsers.push(newUserObj);

    return res.status(201).json({
      success: true,
      message: `Account created successfully. Welcome, ${name.trim()}!`,
      user: {
        id: newUserObj.id,
        name: newUserObj.name,
        email: newUserObj.email,
        role: newUserObj.role,
        regNo: newUserObj.regNo,
        department: newUserObj.department,
        year: newUserObj.year,
        teacherName: newUserObj.teacherName,
        avatarUrl: null,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ success: false, message: 'Server error: ' + (err.message || 'Internal error') });
  }
});

/**
 * GET /api/auth/profile/:id
 */
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let user = null;

    try {
      const [rows] = await pool.execute(
        'SELECT id, name, email, role, reg_no, department, year, teacher_name, avatar_url FROM users WHERE id = ? LIMIT 1',
        [id]
      );
      if (rows && rows.length > 0) user = rows[0];
    } catch (dbErr) {
      user = inMemoryUsers.find(u => u.id === id);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        regNo: user.reg_no || user.regNo,
        department: user.department,
        year: user.year,
        teacherName: user.teacher_name || user.teacherName,
        avatarUrl: user.avatar_url || user.avatarUrl,
      },
    });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ success: false, message: 'Server error: ' + (err.message || 'Internal error') });
  }
});

/**
 * PUT /api/auth/profile/:id
 */
router.put('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, year, teacherName, currentPassword, newPassword } = req.body;

    let existing = null;

    try {
      const [userRows] = await pool.execute('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
      if (userRows && userRows.length > 0) existing = userRows[0];
    } catch (dbErr) {
      existing = inMemoryUsers.find(u => u.id === id);
    }

    if (!existing) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (!name || !name.trim()) return res.status(400).json({ success: false, message: 'Name is required.' });
    if (!email || !email.trim()) return res.status(400).json({ success: false, message: 'Email is required.' });

    let passwordToSet = existing.password;
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ success: false, message: 'Current password is required.' });
      if (currentPassword !== existing.password) return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
      if (newPassword.length < 6) return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
      passwordToSet = newPassword;
    }

    try {
      await pool.execute(
        `UPDATE users SET name=?, email=?, department=?, year=?, teacher_name=?, password=? WHERE id=?`,
        [name.trim(), email.trim().toLowerCase(), department ? department.trim() : existing.department, year ? year.trim() : existing.year, teacherName ? teacherName.trim() : existing.teacher_name, passwordToSet, id]
      );
    } catch (dbErr) {
      const idx = inMemoryUsers.findIndex(u => u.id === id);
      if (idx !== -1) {
        inMemoryUsers[idx] = {
          ...inMemoryUsers[idx],
          name: name.trim(),
          email: email.trim().toLowerCase(),
          department: department ? department.trim() : existing.department,
          year: year ? year.trim() : existing.year,
          teacher_name: teacherName ? teacherName.trim() : existing.teacher_name,
          password: passwordToSet,
        };
      }
    }

    const updatedDto = {
      id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: existing.role,
      regNo: existing.reg_no || existing.regNo,
      department: department ? department.trim() : existing.department,
      year: year ? year.trim() : existing.year,
      teacherName: teacherName ? teacherName.trim() : existing.teacher_name,
      avatarUrl: existing.avatar_url || existing.avatarUrl,
    };

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedDto,
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ success: false, message: 'Server error: ' + (err.message || 'Internal error') });
  }
});

export default router;
