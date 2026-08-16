import React from 'react';
import { useOutpass } from '../context/OutpassContext';
import { COLLEGE_INFO } from '../data/constants';

const Navbar = ({ toggleSidebar }) => {
  const { currentUser, logout } = useOutpass();

  return (
    <nav className="navbar navbar-expand-lg app-navbar sticky-top px-2 px-sm-3 py-2">
      <div className="container-fluid px-1 px-sm-2">
        {/* Left Side: Mobile Sidebar Toggle & College Title */}
        <div className="d-flex align-items-center gap-1 gap-sm-2">
          <button 
            className="btn btn-light d-lg-none border-0 p-1 me-1" 
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <i className="bi bi-list fs-4"></i>
          </button>

          <div className="bg-white px-1.5 px-sm-2 py-1 rounded shadow-sm me-1 me-sm-2 border">
            <img 
              src={COLLEGE_INFO.logo} 
              alt="Apex College Logo" 
              height="30" 
              className="d-inline-block align-text-top rounded" 
            />
          </div>
          <div className="overflow-hidden">
            <span className="fw-bold text-dark font-heading fs-6 d-block lh-1 text-truncate" style={{ maxWidth: '200px' }}>
              Apex Digital Outpass
            </span>
            <small className="text-muted d-none d-sm-block" style={{ fontSize: '0.725rem' }}>
              {COLLEGE_INFO.tagline}
            </small>
          </div>
        </div>

        {/* Right Side: Active User Profile & Actions */}
        <div className="d-flex align-items-center gap-2 gap-sm-3 ms-auto">

          {/* User Profile Badge */}
          {currentUser && (
            <div className="d-flex align-items-center gap-2 border-start ps-2 ps-sm-3">
              {currentUser.avatarUrl || currentUser.avatar ? (
                <img 
                  src={currentUser.avatarUrl || currentUser.avatar} 
                  alt={currentUser.name} 
                  width="36" 
                  height="36" 
                  className="rounded-circle object-fit-cover border border-2 border-primary" 
                />
              ) : (
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '36px', height: '36px', fontSize: '0.95rem' }}>
                  {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="d-none d-sm-block text-start lh-sm">
                <span className="fw-bold d-block text-dark text-truncate" style={{ maxWidth: '140px', fontSize: '0.85rem' }}>
                  {currentUser.name}
                </span>
                <span className="badge bg-primary-subtle text-primary fw-semibold" style={{ fontSize: '0.675rem' }}>
                  {currentUser.role.toUpperCase()}
                </span>
              </div>

              {/* Logout Button */}
              <button 
                className="btn btn-light btn-sm text-danger ms-1 rounded-circle p-1" 
                onClick={logout}
                title="Log Out"
              >
                <i className="bi bi-box-arrow-right fs-5"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
