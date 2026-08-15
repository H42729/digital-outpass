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

// ── Start server ────────────────────────────────────────────────────
async function start() {
  try {
    // Verify database connection
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();

    const server = app.listen(PORT, () => {
      console.log('============================================');
      console.log('  Outpass Management API Server is RUNNING  ');
      console.log(`  http://localhost:${PORT}                  `);
      console.log('============================================');
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Another instance of the server is running.`);
      } else {
        console.error('❌ Server error:', err);
      }
    });
  } catch (err) {
    console.error('❌ Failed to connect to MySQL:', err.message);
    process.exit(1);
  }
}

// ── Start server (only if not running on Vercel) ────────────────────
if (!process.env.VERCEL) {
  start();
}

export default app;


