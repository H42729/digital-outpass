// ====================================================================
// MySQL Connection Pool (mysql2/promise)
// ====================================================================

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const isCloudDb = process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'outpass_db',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
  connectTimeout: 10000,
  ssl: isCloudDb ? { rejectUnauthorized: false } : undefined,
});

export default pool;
