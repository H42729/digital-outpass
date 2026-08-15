import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useOutpass } from '../context/OutpassContext';
import { COLLEGE_INFO, DEPARTMENTS } from '../data/constants';

// ── Role Configuration ────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  student: {
    label: 'Student',
    icon: 'bi-mortarboard-fill',
    color: 'primary',
    gradient: 'linear-gradient(135deg, #1e40af, #2563eb)',
    dashboardPath: '/student',
    loginPath: '/login/student',
  },
  teacher: {
    label: 'Class Teacher',
    icon: 'bi-person-badge-fill',
    color: 'success',
    gradient: 'linear-gradient(135deg, #166534, #16a34a)',
    dashboardPath: '/teacher',
    loginPath: '/login/teacher',
  },
  hod: {
    label: 'HOD',
    icon: 'bi-shield-lock-fill',
    color: 'dark',
    gradient: 'linear-gradient(135deg, #0f172a, #1e293b)',
    dashboardPath: '/hod',
    loginPath: '/login/hod',
  },
};


const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

// ── Password Strength Helper ──────────────────────────────────────────────────
const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) return { score, label: 'Weak', color: '#ef4444' };
  if (score <= 2) return { score, label: 'Fair', color: '#f97316' };
  if (score <= 3) return { score, label: 'Good', color: '#eab308' };
  if (score <= 4) return { score, label: 'Strong', color: '#22c55e' };
  return { score, label: 'Very Strong', color: '#16a34a' };
};

// ── Main Component ────────────────────────────────────────────────────────────
const SignupPage = () => {
  const { role } = useParams();
  const { signup } = useOutpass();
  const navigate = useNavigate();

  const config = ROLE_CONFIG[role] || ROLE_CONFIG.student;

  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    regNo: '',
    year: '',
    teacherName: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const passwordStrength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  // ── Field handlers ──────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ── Client-side validation ──────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.department) errs.department = 'Please select your department.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';

    if (role === 'student') {
      if (!form.regNo.trim()) errs.regNo = 'Registration number is required.';
      if (!form.year) errs.year = 'Please select your year.';
      if (!form.teacherName.trim()) errs.teacherName = 'Class teacher name is required.';
    }

    return errs;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    const user = await signup({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      role,
      department: form.department,
      regNo: form.regNo.trim() || undefined,
      year: form.year || undefined,
      teacherName: form.teacherName.trim() || undefined,
    });

    setIsSubmitting(false);
    if (user) {
      navigate(config.dashboardPath, { replace: true });
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="login-bg signup-bg">
      <div className="container d-flex justify-content-center py-4">
        <div className="signup-card p-4 p-md-5">

          {/* Back to Login */}
          <Link
            to={config.loginPath}
            className="text-decoration-none text-muted small d-inline-flex align-items-center mb-3"
          >
            <i className="bi bi-chevron-left me-1"></i>
            Back to {config.label} Login
          </Link>

          {/* Header */}
          <div className="text-center mb-4">
            <div
              className="signup-role-icon-wrap d-inline-flex align-items-center justify-content-center mb-3"
              style={{ background: config.gradient }}
            >
              <i className={`bi ${config.icon} fs-2 text-white`}></i>
            </div>
            <h4 className="fw-bold font-heading text-dark mb-1">
              {config.label} Registration
            </h4>
            <p className="text-muted small mb-0">{COLLEGE_INFO.name}</p>
          </div>

          {/* Progress pill */}
          <div className="signup-progress-pill mb-4">
            <span className="signup-step-dot active"></span>
            <span className="signup-step-label">Create Account</span>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-dark small">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-person-fill"></i>
                </span>
                <input
                  id="signup-name"
                  type="text"
                  name="name"
                  className={`form-control bg-light border-start-0 py-2 ${errors.name ? 'is-invalid' : ''}`}
                  placeholder={role === 'student' ? 'e.g. Arjun Kumar' : role === 'teacher' ? 'e.g. Prof. Meena Sharma' : 'e.g. Dr. Anand Gupta'}
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-dark small">
                {role === 'student' ? 'Email Address' : 'Institutional Email ID'}
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-envelope-fill"></i>
                </span>
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  className={`form-control bg-light border-start-0 py-2 ${errors.email ? 'is-invalid' : ''}`}
                  placeholder={
                    role === 'student' ? 'arjun.kumar@apex.edu'
                    : role === 'teacher' ? 'meena.sharma@apex.edu'
                    : 'hod.cse@apex.edu'
                  }
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>

            {/* Department */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-dark small">Department</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-building"></i>
                </span>
                <select
                  id="signup-department"
                  name="department"
                  className={`form-select bg-light border-start-0 py-2 ${errors.department ? 'is-invalid' : ''}`}
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.department && <div className="invalid-feedback">{errors.department}</div>}
              </div>
            </div>

            {/* Student-only fields */}
            {role === 'student' && (
              <>
                {/* Registration Number */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark small">Registration Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-card-text"></i>
                    </span>
                    <input
                      id="signup-regNo"
                      type="text"
                      name="regNo"
                      className={`form-control bg-light border-start-0 py-2 ${errors.regNo ? 'is-invalid' : ''}`}
                      placeholder="e.g. AITS2024001"
                      value={form.regNo}
                      onChange={handleChange}
                    />
                    {errors.regNo && <div className="invalid-feedback">{errors.regNo}</div>}
                  </div>
                </div>

                {/* Year */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark small">Current Year</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-calendar3"></i>
                    </span>
                    <select
                      id="signup-year"
                      name="year"
                      className={`form-select bg-light border-start-0 py-2 ${errors.year ? 'is-invalid' : ''}`}
                      value={form.year}
                      onChange={handleChange}
                    >
                      <option value="">Select Year</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    {errors.year && <div className="invalid-feedback">{errors.year}</div>}
                  </div>
                </div>

                {/* Class Teacher Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark small">Class Teacher Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-person-badge"></i>
                    </span>
                    <input
                      id="signup-teacherName"
                      type="text"
                      name="teacherName"
                      className={`form-control bg-light border-start-0 py-2 ${errors.teacherName ? 'is-invalid' : ''}`}
                      placeholder="e.g. Prof. Meena Sharma"
                      value={form.teacherName}
                      onChange={handleChange}
                    />
                    {errors.teacherName && <div className="invalid-feedback">{errors.teacherName}</div>}
                  </div>
                </div>
              </>
            )}

            {/* Password */}
            <div className="mb-1">
              <label className="form-label fw-semibold text-dark small">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-key-fill"></i>
                </span>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`form-control bg-light border-0 py-2 ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="input-group-text bg-light border-start-0 text-muted px-3"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
            </div>

            {/* Password Strength Bar */}
            {form.password && (
              <div className="mb-3 mt-2">
                <div className="pwd-strength-bar">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="pwd-strength-segment"
                      style={{
                        background: i <= passwordStrength.score ? passwordStrength.color : '#e2e8f0',
                        transition: 'background 0.3s ease',
                      }}
                    />
                  ))}
                </div>
                <p className="pwd-strength-label" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </p>
              </div>
            )}

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-dark small">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-shield-lock"></i>
                </span>
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className={`form-control bg-light border-0 py-2 ${errors.confirmPassword ? 'is-invalid' : form.confirmPassword && form.password === form.confirmPassword ? 'is-valid' : ''}`}
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="input-group-text bg-light border-start-0 text-muted px-3"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  tabIndex={-1}
                  aria-label="Toggle confirm password visibility"
                >
                  <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                {!errors.confirmPassword && form.confirmPassword && form.password === form.confirmPassword && (
                  <div className="valid-feedback">Passwords match!</div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="btn w-100 btn-rounded py-3 justify-content-center shadow signup-submit-btn"
              style={{ background: config.gradient, color: 'white', border: 'none' }}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating Account…
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus-fill me-2 fs-5"></i>
                  Create {config.label} Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="signup-divider my-4">
            <span>Already have an account?</span>
          </div>

          {/* Back to login */}
          <Link
            to={config.loginPath}
            className="btn btn-outline-secondary w-100 btn-rounded py-2 justify-content-center"
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
