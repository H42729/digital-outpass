import React, { useState } from 'react';
import { API_BASE_URL } from '../data/constants';

const ForgotPasswordModal = ({ isOpen, onClose, roleLabel }) => {
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter new password, 3 = success
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');

  const resetState = () => {
    setStep(1);
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setLoading(false);
    setUserName('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // Step 1: Verify email exists
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setUserName(data.name || '');
        setStep(2);
      } else {
        setError(data.message || 'Email not found. Please check and try again.');
      }
    } catch (err) {
      setError('Cannot connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Set new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setStep(3);
      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('Cannot connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-custom" onClick={handleClose}>
      <div
        className="forgot-password-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="btn btn-sm btn-light position-absolute top-0 end-0 m-3 rounded-circle shadow-sm"
          onClick={handleClose}
          style={{ width: '32px', height: '32px', padding: 0 }}
        >
          <i className="bi bi-x-lg small"></i>
        </button>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <>
            <div className="text-center mb-4">
              <div
                className="bg-warning-subtle text-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '56px', height: '56px' }}
              >
                <i className="bi bi-key-fill fs-2"></i>
              </div>
              <h5 className="fw-bold text-dark font-heading mb-1">Forgot Password?</h5>
              <p className="text-muted small mb-0">
                Enter your registered {roleLabel || ''} email address to reset your password.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small rounded-3">
                <i className="bi bi-exclamation-triangle me-1"></i> {error}
              </div>
            )}

            <form onSubmit={handleVerifyEmail}>
              <div className="mb-4">
                <label className="form-label fw-semibold text-dark">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="bi bi-envelope-fill"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0 py-2"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-warning w-100 btn-rounded py-2 fw-semibold shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Verifying...
                  </>
                ) : (
                  <>
                    <i className="bi bi-search me-2"></i> Verify Email
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-3">
              <button className="btn btn-link text-muted small text-decoration-none" onClick={handleClose}>
                <i className="bi bi-arrow-left me-1"></i> Back to Login
              </button>
            </div>
          </>
        )}

        {/* Step 2: Enter New Password */}
        {step === 2 && (
          <>
            <div className="text-center mb-4">
              <div
                className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '56px', height: '56px' }}
              >
                <i className="bi bi-shield-lock-fill fs-2"></i>
              </div>
              <h5 className="fw-bold text-dark font-heading mb-1">Reset Password</h5>
              <p className="text-muted small mb-0">
                Account verified for <strong className="text-dark">{userName}</strong>. Enter your new password below.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small rounded-3">
                <i className="bi bi-exclamation-triangle me-1"></i> {error}
              </div>
            )}

            <form onSubmit={handleResetPassword}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">New Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control bg-light border-start-0 py-2"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-dark">Confirm New Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control bg-light border-start-0 py-2"
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 btn-rounded py-2 fw-semibold shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Resetting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle-fill me-2"></i> Reset Password
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-3">
              <button className="btn btn-link text-muted small text-decoration-none" onClick={() => { setStep(1); setError(''); }}>
                <i className="bi bi-arrow-left me-1"></i> Use different email
              </button>
            </div>
          </>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center py-3">
            <div
              className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '64px', height: '64px' }}
            >
              <i className="bi bi-check-lg fs-1"></i>
            </div>
            <h5 className="fw-bold text-dark font-heading mb-2">Password Reset Successful!</h5>
            <p className="text-muted small mb-4">
              Your password has been updated for <strong className="text-dark">{userName}</strong>. You can now log in with your new password.
            </p>
            <button
              className="btn btn-primary-gradient btn-rounded px-4 py-2 shadow-sm"
              onClick={handleClose}
            >
              <i className="bi bi-box-arrow-in-right me-2"></i> Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
