import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOutpass } from '../context/OutpassContext';
import { COLLEGE_INFO } from '../data/constants';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

const StudentLoginPage = () => {
  const { login } = useOutpass();
  const navigate = useNavigate();

  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const user = await login('student', regNo, password);
    if (user) {
      navigate('/student');
    } else {
      setError('Invalid credentials. Please check your email/register number and password.');
    }
  };

  return (
    <div className="login-bg">
      <div className="container d-flex justify-content-center">
        <div className="login-card p-4 p-md-5">
          {/* Back link */}
          <Link to="/login" className="text-decoration-none text-muted small d-inline-flex align-items-center mb-3">
            <i className="bi bi-chevron-left me-1"></i> Back to Role Selection
          </Link>

          {/* Header */}
          <div className="text-center mb-4">
            <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '56px', height: '56px' }}>
              <i className="bi bi-mortarboard-fill fs-2"></i>
            </div>
            <h4 className="fw-bold text-dark font-heading mb-1">Student Portal Login</h4>
            <p className="text-muted small mb-0">{COLLEGE_INFO.name}</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger py-2 small rounded-3">
              <i className="bi bi-exclamation-triangle me-1"></i> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-semibold text-dark">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-envelope-fill"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control bg-light border-start-0 py-2"
                  placeholder="e.g. rahul.sharma@college.edu"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label fw-semibold text-dark">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-key-fill"></i>
                </span>
                <input 
                  type="password" 
                  className="form-control bg-light border-start-0 py-2"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-end mb-3">
              <span className="forgot-link" onClick={() => setIsForgotOpen(true)}>
                <i className="bi bi-question-circle me-1"></i>Forgot Password?
              </span>
            </div>

            <button type="submit" className="btn btn-primary-gradient w-100 btn-rounded py-3 justify-content-center shadow">
              <i className="bi bi-box-arrow-in-right me-2 fs-5"></i> Student Login
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="signup-divider my-4">
            <span>New student? Register below</span>
          </div>
          <Link
            to="/signup/student"
            className="btn btn-outline-primary w-100 btn-rounded py-2 justify-content-center"
          >
            <i className="bi bi-person-plus-fill me-2"></i> Create Student Account
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        roleLabel="student"
      />
    </div>
  );
};

export default StudentLoginPage;
