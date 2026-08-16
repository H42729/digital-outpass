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


