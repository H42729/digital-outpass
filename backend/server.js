// ====================================================================
// APEX DIGITAL OUTPASS MANAGEMENT SYSTEM — Express Server
// ====================================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import authRouter from './routes/auth.js';
import outpassRouter from './routes/outpass.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────────────
app.use(express.json());
app.use(cors({
  origin: true, // Automatically reflects request origin (supports localhost:5173, localhost:5174, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
}));

// ── Routes ──────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/outpasses', outpassRouter);

// ── Health check (root) ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'Apex Digital Outpass Management API (Node.js + Express)',
    timestamp: new Date().toISOString(),
  });
});

// ── Global Error Handler ─────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('❌ Global Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ── Start server ────────────────────────────────────────────────────
async function start() {
  // Try MySQL, but don't crash if unavailable (routes have in-memory fallback)
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');

    // Auto-create tables if they don't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        reg_no VARCHAR(50),
        department VARCHAR(100) NOT NULL,
        year VARCHAR(20),
        teacher_name VARCHAR(100),
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await connection.query(`
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
      )
    `);
    console.log('✅ Database tables verified/created');

    connection.release();
  } catch (err) {
    console.warn('⚠️  MySQL not available — running with in-memory fallback:', err.message);
  }

  // Always start the HTTP server
  const server = app.listen(PORT, () => {
    console.log('============================================');
    console.log('  Outpass Management API Server is RUNNING  ');
    console.log(`  http://localhost:${PORT}                  `);
    console.log('============================================');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use.`);
    } else {
      console.error('❌ Server error:', err);
    }
  });
}

// ── Start server (only if not running on Vercel) ────────────────────
if (!process.env.VERCEL) {
  start();
}

export default app;


