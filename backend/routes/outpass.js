// ====================================================================
// Outpass Routes — CRUD + Teacher/HOD actions
// ====================================================================

import { Router } from 'express';
import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// ── Helper: map a DB row (snake_case) to the camelCase shape the frontend expects ──
function mapRow(r) {
  return {
    id: r.id,
    studentId: r.student_id,
    studentName: r.student_name,
    regNo: r.reg_no,
    department: r.department,
    year: r.year,
    teacherName: r.teacher_name,
    reason: r.reason,
    date: r.date,
    outTime: r.out_time,
    expectedReturnTime: r.expected_return_time,
    teacherStatus: r.teacher_status,
    hodStatus: r.hod_status,
    teacherComments: r.teacher_comments,
    hodComments: r.hod_comments,
    appliedAt: r.applied_at,
    teacherActionAt: r.teacher_action_at,
    hodActionAt: r.hod_action_at,
  };
}

/**
 * GET /api/outpasses
 * Fetch outpass requests with optional query params:
 *   ?role=student&studentId=std_01&search=medical&statusFilter=Pending
 */
router.get('/', async (req, res) => {
  try {
    const { role, studentId, search, statusFilter } = req.query;

    let sql;
    let params = [];

    // 1. Role-based base query
    if (role && role.toLowerCase() === 'student' && studentId && studentId.trim()) {
      sql = 'SELECT * FROM outpass_requests WHERE student_id = ? ORDER BY applied_at DESC';
      params = [studentId];
    } else if (role && role.toLowerCase() === 'hod') {
      // HOD sees only teacher-approved requests
      sql = 'SELECT * FROM outpass_requests WHERE teacher_status = ? ORDER BY applied_at DESC';
      params = ['Approved'];
    } else {
      // Teacher or default: see all
      sql = 'SELECT * FROM outpass_requests ORDER BY applied_at DESC';
    }

    const [rows] = await pool.execute(sql, params);
    let list = rows.map(mapRow);

    // 2. Text search filtering
    if (search && search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(r =>
        r.studentName.toLowerCase().includes(term) ||
        r.regNo.toLowerCase().includes(term) ||
        r.reason.toLowerCase().includes(term) ||
        r.department.toLowerCase().includes(term) ||
        r.id.toLowerCase().includes(term)
      );
    }

    // 3. Status filter
    if (statusFilter && statusFilter.trim() && statusFilter !== 'All') {
      switch (statusFilter) {
        case 'Pending':
          list = list.filter(r =>
            r.teacherStatus === 'Pending' ||
            (r.teacherStatus === 'Approved' && r.hodStatus === 'Pending')
          );
          break;
        case 'Approved':
          list = list.filter(r =>
            r.teacherStatus === 'Approved' && r.hodStatus === 'Approved'
          );
          break;
        case 'Rejected':
          list = list.filter(r =>
            r.teacherStatus === 'Rejected' || r.hodStatus === 'Rejected'
          );
          break;
      }
    }

    return res.json({
      success: true,
      count: list.length,
      requests: list,
    });
  } catch (err) {
    console.error('GET /api/outpasses error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

/**
 * POST /api/outpasses
 * Student creates a new outpass request.
 */
router.post('/', async (req, res) => {
  try {
    const {
      studentId, studentName, regNo, department, year,
      teacherName, reason, date, outTime, expectedReturnTime,
    } = req.body;

    if (!reason || !date || !outTime || !expectedReturnTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required outpass details.',
      });
    }

    // Generate unique ID: OP-YEAR-RANDOM
    const currentYear = new Date().getFullYear();
    const randomNum = 100 + Math.floor(Math.random() * 900);
    const newId = `OP-${currentYear}-${randomNum}`;

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sql = `
      INSERT INTO outpass_requests
        (id, student_id, student_name, reg_no, department, year,
         teacher_name, reason, date, out_time, expected_return_time,
         teacher_status, hod_status, teacher_comments, hod_comments, applied_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'Pending', '', '', ?)
    `;

    await pool.execute(sql, [
      newId, studentId, studentName, regNo, department, year,
      teacherName, reason, date, outTime, expectedReturnTime, now,
    ]);

    // Fetch the inserted row to return it
    const [inserted] = await pool.execute(
      'SELECT * FROM outpass_requests WHERE id = ?', [newId]
    );

    return res.status(201).json({
      success: true,
      message: 'Outpass request submitted successfully.',
      request: mapRow(inserted[0]),
    });
  } catch (err) {
    console.error('POST /api/outpasses error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

/**
 * PUT /api/outpasses/:id/teacher-action
 * Class Teacher approves or rejects a student outpass request.
 */
router.put('/:id/teacher-action', async (req, res) => {
  try {
    const { id } = req.params;
    const { action, comments } = req.body;

    if (!action || (action !== 'Approved' && action !== 'Rejected')) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher action specified. Must be 'Approved' or 'Rejected'.",
      });
    }

    // Check if outpass exists
    const [existing] = await pool.execute(
      'SELECT * FROM outpass_requests WHERE id = ?', [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Outpass request not found.',
      });
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const teacherComments = (comments && comments.trim())
      ? comments
      : (action === 'Approved' ? 'Approved by Class Teacher' : 'Rejected by Class Teacher');

    // If teacher approves, keep HOD status as Pending (forwarding)
    let sql;
    let params;
    if (action === 'Approved') {
      sql = `
        UPDATE outpass_requests
        SET teacher_status = ?, teacher_action_at = ?, teacher_comments = ?, hod_status = 'Pending'
        WHERE id = ?
      `;
      params = [action, now, teacherComments, id];
    } else {
      sql = `
        UPDATE outpass_requests
        SET teacher_status = ?, teacher_action_at = ?, teacher_comments = ?
        WHERE id = ?
      `;
      params = [action, now, teacherComments, id];
    }

    await pool.execute(sql, params);

    // Fetch updated row
    const [updated] = await pool.execute(
      'SELECT * FROM outpass_requests WHERE id = ?', [id]
    );

    const msg = action === 'Approved'
      ? 'Request approved and forwarded to HOD.'
      : 'Request rejected by Class Teacher.';

    return res.json({
      success: true,
      message: msg,
      request: mapRow(updated[0]),
    });
  } catch (err) {
    console.error('PUT teacher-action error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

/**
 * PUT /api/outpasses/:id/hod-action
 * HOD approves or rejects a teacher-approved outpass request.
 */
router.put('/:id/hod-action', async (req, res) => {
  try {
    const { id } = req.params;
    const { action, comments } = req.body;

    if (!action || (action !== 'Approved' && action !== 'Rejected')) {
      return res.status(400).json({
        success: false,
        message: "Invalid HOD action specified. Must be 'Approved' or 'Rejected'.",
      });
    }

    // Check if outpass exists
    const [existing] = await pool.execute(
      'SELECT * FROM outpass_requests WHERE id = ?', [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Outpass request not found.',
      });
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const hodComments = (comments && comments.trim())
      ? comments
      : (action === 'Approved' ? 'Approved by HOD' : 'Rejected by HOD');

    const sql = `
      UPDATE outpass_requests
      SET hod_status = ?, hod_action_at = ?, hod_comments = ?
      WHERE id = ?
    `;

    await pool.execute(sql, [action, now, hodComments, id]);

    // Fetch updated row
    const [updated] = await pool.execute(
      'SELECT * FROM outpass_requests WHERE id = ?', [id]
    );

    const msg = action === 'Approved'
      ? 'Outpass approved by HOD.'
      : 'Outpass rejected by HOD.';

    return res.json({
      success: true,
      message: msg,
      request: mapRow(updated[0]),
    });
  } catch (err) {
    console.error('PUT hod-action error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

/**
 * GET /api/outpasses/health
 * Health check endpoint.
 */
router.get('/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'Apex Digital Outpass Management API (Node.js + Express)',
    timestamp: new Date().toISOString(),
  });
});

export default router;
