import React, { useState, useEffect } from 'react';
import { useOutpass } from '../context/OutpassContext';
import StatusBadge from '../components/StatusBadge';

const TeacherDashboard = () => {
  const { currentUser, requests, approveByTeacher, rejectByTeacher, fetchRequests } = useOutpass();

  const [commentInput, setCommentInput] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Always fetch fresh data when the dashboard mounts
  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCommentChange = (id, val) => {
    setCommentInput(prev => ({ ...prev, [id]: val }));
  };

  const handleApprove = (id) => {
    approveByTeacher(id, commentInput[id] || '');
  };

  const handleReject = (id) => {
    rejectByTeacher(id, commentInput[id] || '');
  };

  // Pending student requests for Class Teacher approval
  const pendingRequests = requests.filter(r => r.teacherStatus === 'Pending');
  const reviewedRequests = requests.filter(r => r.teacherStatus !== 'Pending');

  // Filter requests based on search term & status
  const filteredReviewedRequests = reviewedRequests.filter(req => {
    const matchesSearch = 
      req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'Approved') return req.teacherStatus === 'Approved';
    if (statusFilter === 'Rejected') return req.teacherStatus === 'Rejected';

    return true;
  });

  const totalCount = requests.length;
  const pendingCount = pendingRequests.length;
  const approvedCount = requests.filter(r => r.teacherStatus === 'Approved').length;
  const rejectedCount = requests.filter(r => r.teacherStatus === 'Rejected').length;

  return (
    <div className="container-fluid py-2">
      {/* Header Banner */}
      <div className="dash-card p-4 mb-4 bg-white border-0 shadow-sm rounded-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="badge bg-primary text-white fw-bold px-3 py-1 rounded-pill">
            CLASS TEACHER PORTAL
          </span>
          <span className="text-muted small">• {currentUser?.name || 'Dr. S. Kulkarni'}</span>
        </div>
        <h3 className="fw-bold text-dark font-heading mb-1">
          Student Outpass Approvals Queue
        </h3>
        <p className="text-secondary mb-0" style={{ fontSize: '0.925rem' }}>
          Review leave requests submitted by students. Approving automatically forwards the application to the HOD. Rejecting updates the student's status immediately.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="dash-card p-3 border-start border-4 border-primary d-flex align-items-center justify-content-between">
            <div>
              <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Total Applications</small>
              <h3 className="fw-bold text-dark mb-0">{totalCount}</h3>
            </div>
            <div className="bg-primary-subtle text-primary p-3 rounded-circle">
              <i className="bi bi-files fs-4"></i>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="dash-card p-3 border-start border-4 border-warning d-flex align-items-center justify-content-between">
            <div>
              <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Pending Review</small>
              <h3 className="fw-bold text-dark mb-0">{pendingCount}</h3>
            </div>
            <div className="bg-warning-subtle text-warning p-3 rounded-circle">
              <i className="bi bi-hourglass-split fs-4"></i>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="dash-card p-3 border-start border-4 border-success d-flex align-items-center justify-content-between">
            <div>
              <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Approved by You</small>
              <h3 className="fw-bold text-dark mb-0">{approvedCount}</h3>
            </div>
            <div className="bg-success-subtle text-success p-3 rounded-circle">
              <i className="bi bi-check-circle-fill fs-4"></i>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="dash-card p-3 border-start border-4 border-danger d-flex align-items-center justify-content-between">
            <div>
              <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Rejected by You</small>
              <h3 className="fw-bold text-dark mb-0">{rejectedCount}</h3>
            </div>
            <div className="bg-danger-subtle text-danger p-3 rounded-circle">
              <i className="bi bi-x-circle-fill fs-4"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Incoming Student Outpass Requests Section */}
      <h5 className="font-heading fw-bold text-dark mb-3">
        Pending Student Requests ({pendingRequests.length})
      </h5>

      {pendingRequests.length === 0 ? (
        <div className="dash-card p-5 text-center bg-white border-0 rounded-4 shadow-sm mb-4">
          <i className="bi bi-check2-circle text-success fs-1 mb-2 d-block"></i>
          <h5 className="fw-bold text-dark mb-1">Queue Clear</h5>
          <p className="text-muted small mb-0">All student outpass applications have been reviewed!</p>
        </div>
      ) : (
        <div className="row g-4 mb-5">
          {pendingRequests.map((req) => (
            <div className="col-lg-6" key={req.id}>
              <div className="dash-card h-100 border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column justify-content-between">
                <div>
                  {/* Card Header */}
                  <div className="card-header bg-primary-subtle py-3 px-4 border-bottom d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '38px', height: '38px' }}>
                        {req.studentName.charAt(0)}
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-0">{req.studentName}</h6>
                        <small className="text-muted font-monospace">{req.regNo}</small>
                      </div>
                    </div>
                    <span className="badge bg-warning-subtle text-warning border border-warning-subtle fw-semibold px-3 py-1">
                      Pending Teacher Review
                    </span>
                  </div>

                  {/* Card Details */}
                  <div className="card-body p-4">
                    <div className="row g-3 mb-3" style={{ fontSize: '0.875rem' }}>
                      <div className="col-6">
                        <small className="text-muted d-block">Department</small>
                        <span className="fw-semibold text-dark">{req.department}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Academic Year</small>
                        <span className="fw-semibold text-dark">{req.year}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Outpass Date</small>
                        <span className="fw-bold text-primary">{req.date}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Time Duration</small>
                        <span className="fw-bold text-dark">{req.outTime} → {req.expectedReturnTime}</span>
                      </div>
                    </div>

                    <div className="bg-light p-3 rounded-3 mb-3 border">
                      <small className="text-muted fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.7rem' }}>
                        Reason for Outpass
                      </small>
                      <p className="mb-0 text-dark small">{req.reason}</p>
                    </div>

                    {/* Teacher Remarks Input */}
                    <div className="mb-2">
                      <input 
                        type="text" 
                        className="form-control form-control-sm rounded-3"
                        placeholder="Add teacher remarks (optional)..."
                        value={commentInput[req.id] || ''}
                        onChange={(e) => handleCommentChange(req.id, e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions: Approve / Reject */}
                <div className="card-footer bg-white p-3 border-top d-flex gap-2">
                  <button 
                    className="btn btn-outline-danger btn-rounded w-50"
                    onClick={() => handleReject(req.id)}
                  >
                    <i className="bi bi-x-circle me-1"></i> Reject Request
                  </button>

                  <button 
                    className="btn btn-success btn-rounded w-50 shadow-sm"
                    onClick={() => handleApprove(req.id)}
                  >
                    <i className="bi bi-check-circle me-1"></i> Approve & Forward
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviewed Outpasses Table with Search & Filter */}
      <div className="dash-card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white py-3 px-4 border-bottom">
          <div className="row align-items-center g-3">
            <div className="col-md-4">
              <h6 className="font-heading fw-bold text-dark mb-0">Processed Applications History Log</h6>
            </div>

            {/* Search */}
            <div className="col-md-5">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control form-control-sm bg-light border-start-0"
                  placeholder="Search student, reg no, department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter */}
            <div className="col-md-3 text-md-end">
              <div className="d-flex align-items-center justify-content-md-end gap-2">
                <small className="text-muted fw-semibold">Filter:</small>
                <select
                  className="form-select form-select-sm w-auto rounded-3"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Actions</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-custom align-middle mb-0">
              <thead>
                <tr>
                  <th className="ps-4">Student Details</th>
                  <th>Department & Year</th>
                  <th>Reason</th>
                  <th>Date & Time</th>
                  <th>Teacher Action</th>
                  <th>HOD Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviewedRequests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No reviewed student applications matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredReviewedRequests.map(req => (
                    <tr key={req.id}>
                      <td className="ps-4">
                        <span className="fw-bold text-dark d-block">{req.studentName}</span>
                        <small className="text-muted font-monospace">{req.regNo}</small>
                      </td>
                      <td>{req.department} ({req.year})</td>
                      <td>
                        <small className="text-truncate d-block" style={{ maxWidth: '200px' }}>
                          {req.reason}
                        </small>
                      </td>
                      <td>
                        <span className="fw-medium text-dark">{req.date}</span>
                        <small className="d-block text-muted">{req.outTime} → {req.expectedReturnTime}</small>
                      </td>
                      <td>
                        <StatusBadge status={req.teacherStatus} />
                      </td>
                      <td>
                        <StatusBadge status={req.hodStatus} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
