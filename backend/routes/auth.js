// ====================================================================
// Auth Routes — POST /api/auth/login, POST /api/auth/logout
// ====================================================================

import { Router } from 'express';
import pool from '../db.js';

const router = Router();

/**
 * POST /api/auth/login
 * Authenticates a user by email + password (+ optional role).
 * Returns the user profile without the password.
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

    let sql;
    let params;

    // Match by email OR reg_no (+ password + optional role)
    if (role && role.trim()) {
      sql = 'SELECT * FROM users WHERE (LOWER(email) = LOWER(?) OR LOWER(reg_no) = LOWER(?)) AND password = ? AND role = ? LIMIT 1';
      params = [email, email, password, role];
    } else {
      sql = 'SELECT * FROM users WHERE (LOWER(email) = LOWER(?) OR LOWER(reg_no) = LOWER(?)) AND password = ? LIMIT 1';
      params = [email, email, password];
    }

    const [rows] = await pool.execute(sql, params);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or role mismatch.',
        user: null,
      });
    }

    const user = rows[0];

    // Return user profile without password
    const userDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      regNo: user.reg_no,
      department: user.department,
      year: user.year,
      teacherName: user.teacher_name,
      avatarUrl: user.avatar_url,
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
      message: 'Internal server error.',
      user: null,
    });
  }
});

/**
 * POST /api/auth/logout
 * Simple logout acknowledgement (stateless API, no session to destroy).
 */
router.post('/logout', (_req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
});

/**
 * POST /api/auth/verify-email
 * Check if an email exists in the users table.
 * Returns the user's name if found.
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

    const [rows] = await pool.execute(
      'SELECT id, name, email FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.',
      });
    }

    return res.json({
      success: true,
      message: 'Email verified successfully.',
      name: rows[0].name,
    });
  } catch (err) {
    console.error('Verify email error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset a user's password by email.
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

    // Check if user exists
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1',
      [email]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.',
      });
    }

    // Update password
    await pool.execute(
      'UPDATE users SET password = ? WHERE LOWER(email) = LOWER(?)',
      [newPassword, email]
    );

    return res.json({
      success: true,
      message: 'Password has been reset successfully.',
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
});

/**
 * POST /api/auth/signup
 * Register a new user. Role-specific fields are validated.
 * Returns the new user profile (same DTO as login) for immediate auto-login.
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, regNo, department, year, teacherName } = req.body;

    // ── Basic required fields ──────────────────────────────────────
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

    // ── Role-specific required fields ──────────────────────────────
    if (role === 'student') {
      if (!regNo || !year || !teacherName) {
        return res.status(400).json({
          success: false,
          message: 'Students must provide Registration Number, Year, and Class Teacher Name.',
        });
      }
    }

    // ── Duplicate email check ──────────────────────────────────────
    const [emailRows] = await pool.execute(
      'SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1',
      [email]
    );
    if (emailRows.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // ── Duplicate reg_no check (students only) ─────────────────────
    if (role === 'student' && regNo) {
      const [regRows] = await pool.execute(
        'SELECT id FROM users WHERE LOWER(reg_no) = LOWER(?) LIMIT 1',
        [regNo]
      );
      if (regRows.length > 0) {
        return res.status(409).json({ success: false, message: 'An account with this Registration Number already exists.' });
      }
    }

    // ── Generate unique ID ─────────────────────────────────────────
    const { v4: uuidv4 } = await import('uuid');
    const prefix = role === 'student' ? 'std' : role === 'teacher' ? 'tch' : 'hod';
    const newId = `${prefix}_${uuidv4().slice(0, 8)}`;

    // ── Insert new user ────────────────────────────────────────────
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

    // ── Return user DTO (mirrors login response) ───────────────────
    const userDto = {
      id: newId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      regNo: role === 'student' ? (regNo?.trim() || null) : null,
      department: department.trim(),
      year: role === 'student' ? (year?.trim() || null) : null,
      teacherName: role === 'student' ? (teacherName?.trim() || null) : null,
      avatarUrl: null,
    };

    return res.status(201).json({
      success: true,
      message: `Account created successfully. Welcome, ${name.trim()}!`,
      user: userDto,
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

/**
 * GET /api/auth/profile/:id
 * Fetch a single user's profile by ID (without password).
 */
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, reg_no, department, year, teacher_name, avatar_url FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const u = rows[0];
    return res.json({
      success: true,
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        regNo: u.reg_no,
        department: u.department,
        year: u.year,
        teacherName: u.teacher_name,
        avatarUrl: u.avatar_url,
      },
    });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

/**
 * PUT /api/auth/profile/:id
 * Update a user's editable profile fields.
 * Optionally change password (requires currentPassword + newPassword).
 */
router.put('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, year, teacherName, currentPassword, newPassword } = req.body;

    // Verify user exists
    const [userRows] = await pool.execute(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const existing = userRows[0];

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    // Check email uniqueness (exclude current user)
    if (email.trim().toLowerCase() !== existing.email.toLowerCase()) {
      const [dupRows] = await pool.execute(
        'SELECT id FROM users WHERE LOWER(email) = LOWER(?) AND id != ? LIMIT 1',
        [email, id]
      );
      if (dupRows.length > 0) {
        return res.status(409).json({ success: false, message: 'This email is already used by another account.' });
      }
    }

    // Handle optional password change
    let passwordToSet = existing.password;
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to change your password.' });
      }
      if (currentPassword !== existing.password) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
      }
      passwordToSet = newPassword;
    }

    // Perform update
    await pool.execute(
      `UPDATE users SET
        name         = ?,
        email        = ?,
        department   = ?,
        year         = ?,
        teacher_name = ?,
        password     = ?
       WHERE id = ?`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        department ? department.trim() : existing.department,
        year ? year.trim() : existing.year,
        teacherName ? teacherName.trim() : existing.teacher_name,
        passwordToSet,
        id,
      ]
    );

    // Return updated DTO
    const userDto = {
      id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: existing.role,
      regNo: existing.reg_no,
      department: department ? department.trim() : existing.department,
      year: year ? year.trim() : existing.year,
      teacherName: teacherName ? teacherName.trim() : existing.teacher_name,
      avatarUrl: existing.avatar_url,
    };

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: userDto,
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

export default router;


