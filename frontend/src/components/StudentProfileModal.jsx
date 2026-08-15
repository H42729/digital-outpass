import React, { useState, useEffect } from 'react';
import { useOutpass } from '../context/OutpassContext';
import { DEPARTMENTS } from '../data/constants';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const StudentProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile } = useOutpass();

  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    year: '',
    teacherName: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [errors, setErrors]           = useState({});
  const [isSaving, setIsSaving]       = useState(false);
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [showCurPwd, setShowCurPwd]   = useState(false);
  const [showNewPwd, setShowNewPwd]   = useState(false);
  const [isDirty, setIsDirty]         = useState(false);

  // Populate form from currentUser whenever modal opens
  useEffect(() => {
    if (isOpen && currentUser) {
      setForm({
        name:           currentUser.name        || '',
        email:          currentUser.email       || '',
        department:     currentUser.department  || '',
        year:           currentUser.year        || '',
        teacherName:    currentUser.teacherName || '',
        currentPassword:  '',
        newPassword:      '',
        confirmNewPassword: '',
      });
      setErrors({});
      setIsDirty(false);
      setShowChangePwd(false);
    }
  }, [isOpen, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email.';
    if (!form.department) errs.department = 'Please select your department.';
    if (!form.year) errs.year = 'Please select your year.';
    if (!form.teacherName.trim()) errs.teacherName = 'Class teacher name is required.';

    if (showChangePwd) {
      if (!form.currentPassword) errs.currentPassword = 'Enter your current password.';
      if (!form.newPassword) errs.newPassword = 'Enter a new password.';
      else if (form.newPassword.length < 6) errs.newPassword = 'Min. 6 characters.';
      if (form.newPassword !== form.confirmNewPassword) errs.confirmNewPassword = 'Passwords do not match.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsSaving(true);
    const payload = {
      name:        form.name.trim(),
      email:       form.email.trim(),
      department:  form.department,
      year:        form.year,
      teacherName: form.teacherName.trim(),
      ...(showChangePwd && {
        currentPassword: form.currentPassword,
        newPassword:     form.newPassword,
      }),
    };

    const updated = await updateProfile(payload);
    setIsSaving(false);
    if (updated) {
      setIsDirty(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  const avatarLetter = currentUser?.name?.charAt(0)?.toUpperCase() || 'S';

  return (
    <div className="profile-modal-backdrop" onClick={onClose}>
      <div
        className="profile-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        {/* ── Header ── */}
        <div className="profile-modal-header">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-circle">
              {avatarLetter}
            </div>
            <div className="profile-avatar-badge">
              <i className="bi bi-pencil-fill"></i>
            </div>
          </div>
          <div>
            <h5 id="profile-modal-title" className="fw-bold text-dark font-heading mb-0">
              Edit Your Profile
            </h5>
            <small className="text-muted">
              Student Portal · {currentUser?.regNo || 'No Reg No'}
            </small>
          </div>
          <button
            className="profile-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="profile-modal-body">
          <form id="profile-form" onSubmit={handleSubmit} noValidate>

            {/* Section: Personal Info */}
            <div className="profile-section-label">
              <i className="bi bi-person-circle me-2 text-primary"></i>Personal Information
            </div>

            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold small text-dark">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-person-fill"></i>
                </span>
                <input
                  id="profile-name"
                  type="text"
                  name="name"
                  className={`form-control bg-light border-start-0 py-2 ${errors.name ? 'is-invalid' : ''}`}
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold small text-dark">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-envelope-fill"></i>
                </span>
                <input
                  id="profile-email"
                  type="email"
                  name="email"
                  className={`form-control bg-light border-start-0 py-2 ${errors.email ? 'is-invalid' : ''}`}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>

            {/* Registration No (read-only) */}
            <div className="mb-3">
              <label className="form-label fw-semibold small text-dark">Registration Number</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-card-text"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0 py-2 text-secondary"
                  value={currentUser?.regNo || '—'}
                  readOnly
                  style={{ cursor: 'not-allowed' }}
                />
                <span className="input-group-text bg-light text-muted small">Read-only</span>
              </div>
              <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                Registration number cannot be changed.
              </small>
            </div>

            {/* Section: Academic Details */}
            <div className="profile-section-label mt-4">
              <i className="bi bi-mortarboard-fill me-2 text-primary"></i>Academic Details
            </div>

            {/* Department */}
            <div className="mb-3">
              <label className="form-label fw-semibold small text-dark">Department</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-building"></i>
                </span>
                <select
                  id="profile-department"
                  name="department"
                  className={`form-select bg-light border-start-0 py-2 ${errors.department ? 'is-invalid' : ''}`}
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.department && <div className="invalid-feedback">{errors.department}</div>}
              </div>
            </div>

            {/* Year */}
            <div className="mb-3">
              <label className="form-label fw-semibold small text-dark">Current Year</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-calendar3"></i>
                </span>
                <select
                  id="profile-year"
                  name="year"
                  className={`form-select bg-light border-start-0 py-2 ${errors.year ? 'is-invalid' : ''}`}
                  value={form.year}
                  onChange={handleChange}
                >
                  <option value="">Select Year</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                {errors.year && <div className="invalid-feedback">{errors.year}</div>}
              </div>
            </div>

            {/* Class Teacher Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold small text-dark">Class Teacher Name</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-person-badge"></i>
                </span>
                <input
                  id="profile-teacherName"
                  type="text"
                  name="teacherName"
                  className={`form-control bg-light border-start-0 py-2 ${errors.teacherName ? 'is-invalid' : ''}`}
                  value={form.teacherName}
                  onChange={handleChange}
                  placeholder="e.g. Prof. Meena Sharma"
                />
                {errors.teacherName && <div className="invalid-feedback">{errors.teacherName}</div>}
              </div>
            </div>

            {/* Section: Change Password */}
            <div className="mt-4">
              <button
                type="button"
                className="profile-pwd-toggle w-100"
                onClick={() => { setShowChangePwd((p) => !p); setErrors({}); }}
              >
                <span>
                  <i className={`bi ${showChangePwd ? 'bi-chevron-up' : 'bi-chevron-down'} me-2`}></i>
                  <i className="bi bi-key-fill me-2 text-warning"></i>
                  Change Password
                </span>
                <span className={`profile-pwd-badge ${showChangePwd ? 'active' : ''}`}>
                  {showChangePwd ? 'Cancel' : 'Optional'}
                </span>
              </button>

              {showChangePwd && (
                <div className="profile-pwd-panel">
                  {/* Current Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-dark">Current Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted">
                        <i className="bi bi-lock-fill"></i>
                      </span>
                      <input
                        id="profile-current-password"
                        type={showCurPwd ? 'text' : 'password'}
                        name="currentPassword"
                        className={`form-control bg-light border-0 py-2 ${errors.currentPassword ? 'is-invalid' : ''}`}
                        value={form.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter current password"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="input-group-text bg-light border-start-0 text-muted"
                        onClick={() => setShowCurPwd((p) => !p)}
                        tabIndex={-1}
                      >
                        <i className={`bi ${showCurPwd ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                      {errors.currentPassword && <div className="invalid-feedback">{errors.currentPassword}</div>}
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-dark">New Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted">
                        <i className="bi bi-key-fill"></i>
                      </span>
                      <input
                        id="profile-new-password"
                        type={showNewPwd ? 'text' : 'password'}
                        name="newPassword"
                        className={`form-control bg-light border-0 py-2 ${errors.newPassword ? 'is-invalid' : ''}`}
                        value={form.newPassword}
                        onChange={handleChange}
                        placeholder="Min. 6 characters"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="input-group-text bg-light border-start-0 text-muted"
                        onClick={() => setShowNewPwd((p) => !p)}
                        tabIndex={-1}
                      >
                        <i className={`bi ${showNewPwd ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                      {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="mb-1">
                    <label className="form-label fw-semibold small text-dark">Confirm New Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted">
                        <i className="bi bi-shield-lock"></i>
                      </span>
                      <input
                        id="profile-confirm-new-password"
                        type="password"
                        name="confirmNewPassword"
                        className={`form-control bg-light border-start-0 py-2 ${
                          errors.confirmNewPassword ? 'is-invalid'
                          : form.confirmNewPassword && form.newPassword === form.confirmNewPassword ? 'is-valid'
                          : ''
                        }`}
                        value={form.confirmNewPassword}
                        onChange={handleChange}
                        placeholder="Re-enter new password"
                        autoComplete="new-password"
                      />
                      {errors.confirmNewPassword && <div className="invalid-feedback">{errors.confirmNewPassword}</div>}
                      {!errors.confirmNewPassword && form.confirmNewPassword && form.newPassword === form.confirmNewPassword && (
                        <div className="valid-feedback">Passwords match!</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* ── Footer ── */}
        <div className="profile-modal-footer">
          <button
            type="button"
            className="btn btn-light border btn-rounded px-4 py-2"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            id="profile-update-btn"
            type="submit"
            form="profile-form"
            disabled={isSaving || !isDirty}
            className="btn btn-primary-gradient btn-rounded px-5 py-2 profile-update-btn"
          >
            {isSaving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving…
              </>
            ) : (
              <>
                <i className="bi bi-check2-circle me-2"></i>
                Update Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileModal;
