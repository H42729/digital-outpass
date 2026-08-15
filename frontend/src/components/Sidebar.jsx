import React, { useState } from 'react';
import { useOutpass } from '../context/OutpassContext';
import StudentProfileModal from './StudentProfileModal';

const Sidebar = ({ isOpen, closeSidebar, openOutpassModal }) => {
  const { currentUser, logout } = useOutpass();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getRoleTitle = (role) => {
    switch (role) {
      case 'student': return 'Student Portal';
      case 'teacher': return 'Class Teacher Portal';
      case 'hod': return 'HOD Approval Portal';
      default: return 'Portal';
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="sidebar-mobile-backdrop d-lg-none" 
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar-wrapper ${isOpen ? 'show' : ''} p-3 d-flex flex-column justify-content-between`}>
        <div>
          {/* User Card Summary */}
          <div className="card border-0 bg-light p-3 rounded-4 mb-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{ width: '40px', height: '40px', fontSize: '1rem' }}
              >
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <h6 className="fw-bold mb-0 text-dark text-truncate" style={{ fontSize: '0.9rem' }}>
                  {currentUser?.name}
                </h6>
                <small className="text-muted d-block text-truncate" style={{ fontSize: '0.75rem' }}>
                  {currentUser?.email}
                </small>
              </div>
            </div>

            {/* Role badge — clickable for students to open profile */}
            {currentUser?.role === 'student' ? (
              <button
                className="role-badge-pill mt-1 text-center w-100 border-0 sidebar-portal-btn"
                onClick={() => {
                  closeSidebar();
                  setIsProfileOpen(true);
                }}
                title="Click to edit your profile"
              >
                <i className="bi bi-pencil-fill me-1" style={{ fontSize: '0.65rem' }}></i>
                {getRoleTitle(currentUser?.role)}
              </button>
            ) : (
              <div className="role-badge-pill mt-1 text-center">
                {getRoleTitle(currentUser?.role)}
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <div className="mb-4">
            <small className="text-muted fw-bold text-uppercase px-2 mb-2 d-block" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
              Main Menu
            </small>

            {/* Student Menu */}
            {currentUser?.role === 'student' && (
              <>
                <button
                  className="sidebar-link active w-100 border-0 text-start"
                  onClick={closeSidebar}
                >
                  <i className="bi bi-grid-fill fs-5"></i> Student Dashboard
                </button>
                <button
                  className="sidebar-link w-100 border-0 text-start text-primary fw-semibold"
                  onClick={() => {
                    closeSidebar();
                    if (openOutpassModal) openOutpassModal();
                  }}
                >
                  <i className="bi bi-file-earmark-plus-fill fs-5"></i> Apply Outpass
                </button>
                <button
                  className="sidebar-link w-100 border-0 text-start"
                  onClick={() => {
                    closeSidebar();
                    setIsProfileOpen(true);
                  }}
                >
                  <i className="bi bi-person-circle fs-5"></i> My Profile
                </button>
              </>
            )}

            {/* Class Teacher Menu */}
            {currentUser?.role === 'teacher' && (
              <button
                className="sidebar-link active w-100 border-0 text-start"
                onClick={closeSidebar}
              >
                <i className="bi bi-card-checklist fs-5"></i> Teacher Approvals
              </button>
            )}

            {/* HOD Menu */}
            {currentUser?.role === 'hod' && (
              <button
                className="sidebar-link active w-100 border-0 text-start"
                onClick={closeSidebar}
              >
                <i className="bi bi-shield-check fs-5"></i> HOD Final Approvals
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-top pt-3">
          <button
            className="btn btn-outline-danger w-100 btn-rounded border-0 text-start px-3"
            onClick={logout}
          >
            <i className="bi bi-box-arrow-right fs-5"></i> Sign Out
          </button>
        </div>
      </aside>

      {/* Student Profile Edit Modal */}
      {currentUser?.role === 'student' && (
        <StudentProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
