// College metadata constants (no dummy user/request data)
export const COLLEGE_INFO = {
  name: 'PSNA College of Engineering & Technology',
  tagline: 'Trust In God • Estd: 1984 • Dindigul - 624 622',
  code: 'PSNA-CET-624622',
  logo: '/logo.png'
};

// Backend API base URL (dynamic for local localhost, VITE_API_URL env, or Vercel serverless)
export const API_BASE_URL = import.meta.env.VITE_API_URL 
  || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : '');

// Institutional Departments list
export const DEPARTMENTS = [
  'MCA',
  'MBA',
  'Computer Science Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Data Science (AI & DS)',
  'Artificial Intelligence & Machine Learning (AI & ML)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biomedical Engineering',
];

