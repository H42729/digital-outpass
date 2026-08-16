// ====================================================================
// Outpass Routes — CRUD + Teacher/HOD actions
// ====================================================================

import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// Fallback seed outpass requests for serverless environments (e.g. Vercel) when MySQL is disconnected
let inMemoryOutpasses = [
  {
    id: 'OP-2026-904',
    student_id: 'std_01',
    student_name: 'Arjun Kumar',
    reg_no: 'AITS2024001',
    department: 'Computer Science',
    year: '3rd Year',
    teacher_name: 'Prof. Meena Sharma',
    reason: 'Medical checkup at City Hospital',
    date: '2026-08-16',
    out_time: '10:00 AM',
    expected_return_time: '04:00 PM',
    teacher_status: 'Pending',
    hod_status: 'Pending',
    teacher_comments: null,
    hod_comments: null,
    applied_at: '2026-08-16 09:30:00',
    teacher_action_at: null,
    hod_action_at: null,
  },
  {
    id: 'OP-2026-881',
    student_id: 'std_02',
    student_name: 'Priya Patel',
    reg_no: 'AITS2024002',
    department: 'Electronics',
    year: '2nd Year',
    teacher_name: 'Prof. Rajesh Verma',
    reason: 'Inter-College Robotics Hackathon',
    date: '2026-08-16',
    out_time: '08:30 AM',
    expected_return_time: '06:00 PM',
    teacher_status: 'Approved',
    hod_status: 'Pending',
    teacher_comments: 'Recommended for technical competition',
    hod_comments: null,
    applied_at: '2026-08-15 14:20:00',
    teacher_action_at: '2026-08-15 16:00:00',
    hod_action_at: null,
  },
  {
    id: 'OP-2026-732',
    student_id: 'std_03',
    student_name: 'Rahul Singh',
    reg_no: 'AITS2024003',
    department: 'Computer Science',
    year: '4th Year',
    teacher_name: 'Prof. Meena Sharma',
    reason: 'Family function in home town',
    date: '2026-08-15',
    out_time: '09:00 AM',
    expected_return_time: '08:00 PM',
    teacher_status: 'Approved',
    hod_status: 'Approved',
    teacher_comments: 'Approved based on parent request',
    hod_comments: 'Final Outpass Granted',
    applied_at: '2026-08-14 11:00:00',
    teacher_action_at: '2026-08-14 11:30:00',
    hod_action_at: '2026-08-14 12:15:00',
  }
];

function mapRow(r) {
  return {
    id: r.id,
    studentId: r.student_id || r.studentId,
    studentName: r.student_name || r.studentName,
    regNo: r.reg_no || r.regNo,
    department: r.department,
    year: r.year,
    teacherName: r.teacher_name || r.teacherName,
    reason: r.reason,
    date: r.date,
    outTime: r.out_time || r.outTime,
    expectedReturnTime: r.expected_return_time || r.expectedReturnTime,
    teacherStatus: r.teacher_status || r.teacherStatus,
    hodStatus: r.hod_status || r.hodStatus,
    teacherComments: r.teacher_comments || r.teacherComments,
    hodComments: r.hod_comments || r.hodComments,
    appliedAt: r.applied_at || r.appliedAt,
    teacherActionAt: r.teacher_action_at || r.teacherActionAt,
    hodActionAt: r.hod_action_at || r.hodActionAt,
  };
}

/**
 * GET /api/outpasses
 */
router.get('/', async (req, res) => {
  try {
    const { role, studentId, search, statusFilter } = req.query;
    let list = [];

    try {
      let sql;
      let params = [];
      if (role && role.toLowerCase() === 'student' && studentId && studentId.trim()) {
        sql = 'SELECT * FROM outpass_requests WHERE student_id = ? ORDER BY applied_at DESC';
        params = [studentId];
      } else if (role && role.toLowerCase() === 'hod') {
        sql = 'SELECT * FROM outpass_requests WHERE teacher_status = ? ORDER BY applied_at DESC';
        params = ['Approved'];
      } else {
        sql = 'SELECT * FROM outpass_requests ORDER BY applied_at DESC';
      }
      const [rows] = await pool.execute(sql, params);
      list = rows.map(mapRow);
    } catch (dbErr) {
      console.warn('MySQL unavailable, using in-memory outpass fallback:', dbErr.message);
      let rawList = [...inMemoryOutpasses];
      if (role && role.toLowerCase() === 'student' && studentId) {
        rawList = rawList.filter(r => r.student_id === studentId);
      } else if (role && role.toLowerCase() === 'hod') {
        rawList = rawList.filter(r => r.teacher_status === 'Approved');
      }
      list = rawList.map(mapRow);
    }

    if (search && search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(r =>
        (r.studentName && r.studentName.toLowerCase().includes(term)) ||
        (r.regNo && r.regNo.toLowerCase().includes(term)) ||
        (r.reason && r.reason.toLowerCase().includes(term)) ||
        (r.department && r.department.toLowerCase().includes(term)) ||
        (r.id && r.id.toLowerCase().includes(term))
      );
    }

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
    return res.status(500).json({ success: false, message: 'Server error: ' + (err.message || 'Internal error') });
  }
});

/**
 * POST /api/outpasses
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

    const currentYear = new Date().getFullYear();
    const randomNum = 100 + Math.floor(Math.random() * 900);
    const newId = `OP-${currentYear}-${randomNum}`;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let newRecord = {
      id: newId,
      student_id: studentId,
      student_name: studentName,
      reg_no: regNo,
      department: department,
      year: year,
      teacher_name: teacherName,
      reason: reason,
      date: date,
      out_time: outTime,
      expected_return_time: expectedReturnTime,
      teacher_status: 'Pending',
      hod_status: 'Pending',
      teacher_comments: '',
      hod_comments: '',
      applied_at: now,
      teacher_action_at: null,
      hod_action_at: null,
    };

    try {
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
    } catch (dbErr) {
      console.warn('MySQL insert unavailable, using in-memory outpass:', dbErr.message);
    }

    inMemoryOutpasses.unshift(newRecord);

    return res.status(201).json({
      success: true,
      message: 'Outpass request submitted successfully.',
      request: mapRow(newRecord),
    });
  } catch (err) {
    console.error('POST /api/outpasses error:', err);
    return res.status(500).json({ success: false, message: 'Server error: ' + (err.message || 'Internal error') });
  }
});

/**
 * PUT /api/outpasses/:id/teacher-action
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

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const teacherComments = (comments && comments.trim())
      ? comments
      : (action === 'Approved' ? 'Approved by Class Teacher' : 'Rejected by Class Teacher');

    let item = inMemoryOutpasses.find(r => r.id === id);

    try {
      let sql = action === 'Approved'
        ? `UPDATE outpass_requests SET teacher_status = ?, teacher_action_at = ?, teacher_comments = ?, hod_status = 'Pending' WHERE id = ?`
        : `UPDATE outpass_requests SET teacher_status = ?, teacher_action_at = ?, teacher_comments = ? WHERE id = ?`;
      let params = action === 'Approved' ? [action, now, teacherComments, id] : [action, now, teacherComments, id];
      await pool.execute(sql, params);
      const [updated] = await pool.execute('SELECT * FROM outpass_requests WHERE id = ?', [id]);
      if (updated && updated.length > 0) item = updated[0];
    } catch (dbErr) {
      if (item) {
        item.teacher_status = action;
        item.teacher_action_at = now;
        item.teacher_comments = teacherComments;
        if (action === 'Approved') item.hod_status = 'Pending';
      }
    }

    if (!item) {
      return res.status(404).json({ success: false, message: 'Outpass request not found.' });
    }

    const msg = action === 'Approved'
      ? 'Request approved and forwarded to HOD.'
      : 'Request rejected by Class Teacher.';

    return res.json({
      success: true,
      message: msg,
      request: mapRow(item),
    });
  } catch (err) {
    console.error('PUT teacher-action error:', err);
    return res.status(500).json({ success: false, message: 'Server error: ' + (err.message || 'Internal error') });
  }
});

/**
 * PUT /api/outpasses/:id/hod-action
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

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const hodComments = (comments && comments.trim())
      ? comments
      : (action === 'Approved' ? 'Approved by HOD' : 'Rejected by HOD');

    let item = inMemoryOutpasses.find(r => r.id === id);

    try {
      const sql = `UPDATE outpass_requests SET hod_status = ?, hod_action_at = ?, hod_comments = ? WHERE id = ?`;
      await pool.execute(sql, [action, now, hodComments, id]);
      const [updated] = await pool.execute('SELECT * FROM outpass_requests WHERE id = ?', [id]);
      if (updated && updated.length > 0) item = updated[0];
    } catch (dbErr) {
      if (item) {
        item.hod_status = action;
        item.hod_action_at = now;
        item.hod_comments = hodComments;
      }
    }

    if (!item) {
      return res.status(404).json({ success: false, message: 'Outpass request not found.' });
    }

    const msg = action === 'Approved'
      ? 'Outpass approved by HOD.'
      : 'Outpass rejected by HOD.';

    return res.json({
      success: true,
      message: msg,
      request: mapRow(item),
    });
  } catch (err) {
    console.error('PUT hod-action error:', err);
    return res.status(500).json({ success: false, message: 'Server error: ' + (err.message || 'Internal error') });
  }
});

/**
 * GET /api/outpasses/health
 */
router.get('/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'Apex Digital Outpass Management API (Node.js + Express)',
    timestamp: new Date().toISOString(),
  });
});

export default router;
