import React from 'react';
import { Link } from 'react-router-dom';
import { COLLEGE_INFO } from '../data/constants';

const RoleSelectionPage = () => {
  return (
    <div className="login-bg py-5">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Branding Header with PSNA Banner Logo */}
        <div className="text-center mb-5">
          <div className="bg-white p-3 p-md-4 rounded-4 shadow-lg d-inline-block mb-4" style={{ maxWidth: '650px', width: '100%' }}>
            <img 
              src={COLLEGE_INFO.logo} 
              alt="PSNA College of Engineering & Technology" 
              className="img-fluid rounded"
              style={{ maxHeight: '140px', objectFit: 'contain' }}
            />
          </div>
          <h2 className="fw-bold font-heading text-dark mb-1">{COLLEGE_INFO.name}</h2>
          <p className="text-primary fw-bold text-uppercase fs-6 mb-2" style={{ letterSpacing: '1px' }}>
            Digital Outpass Management System
          </p>
          <p className="text-muted small mb-0">Select your portal to proceed to login</p>
        </div>

        {/* 3 Separate Role Login Cards */}
        <div className="row g-4 justify-content-center">
          {/* Student Portal Card */}
          <div className="col-md-4">
            <div className="card border-0 rounded-4 shadow-lg h-100 p-4 text-center d-flex flex-column justify-content-between hover-lift">
              <div>
                <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                  <i className="bi bi-mortarboard-fill fs-1"></i>
                </div>
                <h5 className="fw-bold text-dark font-heading mb-2">Student Portal</h5>
                <p className="text-muted small mb-4">
                  Apply for digital outpasses and track approval progress in real-time.
                </p>
              </div>

              <Link to="/login/student" className="btn btn-primary-gradient btn-rounded w-100 justify-content-center shadow-sm">
                Student Login <i className="bi bi-arrow-right me-1"></i>
              </Link>
            </div>
          </div>

          {/* Class Teacher Portal Card */}
          <div className="col-md-4">
            <div className="card border-0 rounded-4 shadow-lg h-100 p-4 text-center d-flex flex-column justify-content-between hover-lift">
              <div>
                <div className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                  <i className="bi bi-person-badge-fill fs-1"></i>
                </div>
                <h5 className="fw-bold text-dark font-heading mb-2">Class Teacher Portal</h5>
                <p className="text-muted small mb-4">
                  Review student leave requests and forward approved applications to HOD.
                </p>
              </div>

              <Link to="/login/teacher" className="btn btn-success btn-rounded w-100 justify-content-center shadow-sm">
                Class Teacher Login <i className="bi bi-arrow-right me-1"></i>
              </Link>
            </div>
          </div>

          {/* HOD Portal Card */}
          <div className="col-md-4">
            <div className="card border-0 rounded-4 shadow-lg h-100 p-4 text-center d-flex flex-column justify-content-between hover-lift">
              <div>
                <div className="bg-dark text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                  <i className="bi bi-shield-lock-fill fs-1"></i>
                </div>
                <h5 className="fw-bold text-dark font-heading mb-2">HOD Executive Portal</h5>
                <p className="text-muted small mb-4">
                  Grant final sign-off for teacher-approved campus outpasses.
                </p>
              </div>

              <Link to="/login/hod" className="btn btn-dark btn-rounded w-100 justify-content-center shadow-sm">
                HOD Login <i className="bi bi-arrow-right me-1"></i>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-5">
          <small className="text-muted fw-semibold">PSNA College of Engineering & Technology • Digital Outpass System</small>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
