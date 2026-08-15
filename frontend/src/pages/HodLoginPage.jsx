import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOutpass } from '../context/OutpassContext';
import { COLLEGE_INFO } from '../data/constants';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

const HodLoginPage = () => {
  const { login } = useOutpass();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const user = await login('hod', email, password);
    if (user) {
      navigate('/hod');
    } else {
      setError('Invalid credentials. Please check your email and password.');
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
            <div className="bg-dark text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '56px', height: '56px' }}>
              <i className="bi bi-shield-lock-fill fs-2"></i>
            </div>
            <h4 className="fw-bold text-dark font-heading mb-1">HOD Executive Login</h4>
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
              <label className="form-label fw-semibold text-dark">HOD Email ID</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-envelope-at"></i>
                </span>
                <input 
                  type="email" 
                  className="form-control bg-light border-start-0 py-2"
                  placeholder="e.g. hod.cse@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

            <button type="submit" className="btn btn-dark w-100 btn-rounded py-3 justify-content-center shadow">
              <i className="bi bi-box-arrow-in-right me-2 fs-5"></i> HOD Login
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="signup-divider my-4">
            <span>New HOD? Register below</span>
          </div>
          <Link
            to="/signup/hod"
            className="btn btn-outline-dark w-100 btn-rounded py-2 justify-content-center"
          >
            <i className="bi bi-person-plus-fill me-2"></i> Create HOD Account
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        roleLabel="HOD"
      />
    </div>
  );
};

export default HodLoginPage;
