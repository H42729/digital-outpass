import React, { useState, useEffect } from 'react';
import { useOutpass } from '../context/OutpassContext';
import StatusBadge from '../components/StatusBadge';

const HodDashboard = () => {
  const { currentUser, requests, approveByHod, rejectByHod, fetchRequests } = useOutpass();

  const [commentInput, setCommentInput] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Always fetch fresh data when the dashboard mounts
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleCommentChange = (id, val) => {
    setCommentInput(prev => ({ ...prev, [id]: val }));
  };

  const handleApprove = (id) => {
    approveByHod(id, commentInput[id] || '');
  };

  const handleReject = (id) => {
    rejectByHod(id, commentInput[id] || '');
  };

  // HOD receives ONLY requests approved by Class Teacher
  const teacherApprovedRequests = requests.filter(r => r.teacherStatus === 'Approved');
  const pendingHodQueue = teacherApprovedRequests.filter(r => r.hodStatus === 'Pending');
  const processedByHod = teacherApprovedRequests.filter(r => r.hodStatus !== 'Pending');

  // Search & Filter for HOD decision history
  const filteredProcessed = processedByHod.filter(req => {
    const matchesSearch = 
      req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'Approved') return req.hodStatus === 'Approved';
    if (statusFilter === 'Rejected') return req.hodStatus === 'Rejected';

    return true;
  });

  const totalTeacherApprovedCount = teacherApprovedRequests.length;
  const pendingHodCount = pendingHodQueue.length;
  const hodApprovedCount = teacherApprovedRequests.filter(r => r.hodStatus === 'Approved').length;
  const hodRejectedCount = teacherApprovedRequests.filter(r => r.hodStatus === 'Rejected').length;

  return (
    <div className="container-fluid py-2">
      {/* Header Banner */}
      <div className="dash-card p-3 p-sm-4 mb-4 bg-white border-0 shadow-sm rounded-4">
        <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
          <span className="badge bg-dark text-white fw-bold px-3 py-1 rounded-pill">
            HOD EXECUTIVE PORTAL
          </span>
          <span className="text-muted small">• {currentUser?.name || 'Dr. A. R. Venkatesh'}</span>
        </div>
        <h3 className="fw-bold text-dark font-heading mb-1 fs-4 fs-sm-3">
          Final Outpass Approval Desk
        </h3>
        <p className="text-secondary mb-0" style={{ fontSize: '0.9rem' }}>
          Review outpasses pre-approved by Class Teachers. Approving updates status to "Approved by HOD" and grants official gate pass. Rejecting updates status to "Rejected by HOD".
        </p>
      </div>

      {/* Metrics Row */}
      <div className="row g-2 g-sm-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="dash-card p-2.5 p-sm-3 border-start border-4 border-info d-flex align-items-center justify-content-between gap-2 overflow-hidden">
            <div className="min-w-0 flex-grow-1">
              <small className="text-muted fw-bold text-uppercase d-block text-truncate" style={{ fontSize: '0.675rem' }}>Received from Teacher</small>
              <h3 className="fw-bold text-dark mb-0 fs-4 fs-sm-3">{totalTeacherApprovedCount}</h3>
            </div>
            <div className="bg-info-subtle text-info d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-inbox-fill fs-5"></i>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="dash-card p-2.5 p-sm-3 border-start border-4 border-warning d-flex align-items-center justify-content-between gap-2 overflow-hidden">
            <div className="min-w-0 flex-grow-1">
              <small className="text-muted fw-bold text-uppercase d-block text-truncate" style={{ fontSize: '0.675rem' }}>Awaiting Sign-Off</small>
              <h3 className="fw-bold text-dark mb-0 fs-4 fs-sm-3">{pendingHodCount}</h3>
            </div>
            <div className="bg-warning-subtle text-warning d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-clock fs-5"></i>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="dash-card p-2.5 p-sm-3 border-start border-4 border-success d-flex align-items-center justify-content-between gap-2 overflow-hidden">
            <div className="min-w-0 flex-grow-1">
              <small className="text-muted fw-bold text-uppercase d-block text-truncate" style={{ fontSize: '0.675rem' }}>Approved by HOD</small>
              <h3 className="fw-bold text-dark mb-0 fs-4 fs-sm-3">{hodApprovedCount}</h3>
            </div>
            <div className="bg-success-subtle text-success d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-patch-check-fill fs-5"></i>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="dash-card p-2.5 p-sm-3 border-start border-4 border-danger d-flex align-items-center justify-content-between gap-2 overflow-hidden">
            <div className="min-w-0 flex-grow-1">
              <small className="text-muted fw-bold text-uppercase d-block text-truncate" style={{ fontSize: '0.675rem' }}>Rejected by HOD</small>
              <h3 className="fw-bold text-dark mb-0 fs-4 fs-sm-3">{hodRejectedCount}</h3>
            </div>
            <div className="bg-danger-subtle text-danger d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-shield-x fs-5"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Approved Request Cards Queue for HOD */}
      <h5 className="font-heading fw-bold text-dark mb-3">
        Teacher-Approved Queue ({pendingHodQueue.length})
      </h5>

      {pendingHodQueue.length === 0 ? (
        <div className="dash-card p-5 text-center bg-white border-0 rounded-4 shadow-sm mb-4">
          <i className="bi bi-shield-check text-primary fs-1 mb-2 d-block"></i>
          <h5 className="fw-bold text-dark mb-1">Queue Clear</h5>
          <p className="text-muted small mb-0">No teacher-approved requests pending HOD sign-off at the moment.</p>
        </div>
      ) : (
        <div className="row g-4 mb-5">
          {pendingHodQueue.map((req) => (
            <div className="col-lg-6" key={req.id}>
              <div className="dash-card h-100 border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column justify-content-between">
                <div>
                  {/* Card Header */}
                  <div className="card-header bg-dark text-white py-3 px-4 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '38px', height: '38px' }}>
                        {req.studentName.charAt(0)}
                      </div>
                      <div>
                        <h6 className="fw-bold text-white mb-0">{req.studentName}</h6>
                        <small className="opacity-75 font-monospace">{req.regNo}</small>
                      </div>
                    </div>
                    <span className="badge bg-success text-white px-3 py-1">
                      <i className="bi bi-check-circle me-1"></i> Class Teacher Approved
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
                        <small className="text-muted d-block">Teacher Approval</small>
                        <StatusBadge status={req.teacherStatus} />
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Out Date</small>
                        <span className="fw-bold text-primary">{req.date}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Out & Return Time</small>
                        <span className="fw-bold text-dark">{req.outTime} → {req.expectedReturnTime}</span>
                      </div>
                    </div>

                    <div className="bg-light p-3 rounded-3 mb-3 border">
                      <small className="text-muted fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.7rem' }}>
                        Outpass Reason
                      </small>
                      <p className="mb-0 text-dark small">{req.reason}</p>
                    </div>

                    {req.teacherComments && (
                      <div className="mb-3 p-2 bg-success-subtle rounded text-success small">
                        <i className="bi bi-chat-quote me-1"></i>
                        <strong>Teacher Remark:</strong> "{req.teacherComments}"
                      </div>
                    )}

                    {/* HOD Remarks Input */}
                    <div>
                      <input 
                        type="text" 
                        className="form-control form-control-sm rounded-3"
                        placeholder="Add HOD sign-off remarks (optional)..."
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
                    <i className="bi bi-x-lg me-1"></i> Reject Outpass
                  </button>

                  <button 
                    className="btn btn-success btn-rounded w-50 shadow-sm"
                    onClick={() => handleApprove(req.id)}
                  >
                    <i className="bi bi-shield-check me-1"></i> Approve Outpass
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History Log of HOD Actions with Search & Filter */}
      <div className="dash-card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white py-3 px-4 border-bottom">
          <div className="row align-items-center g-3">
            <div className="col-md-4">
              <h6 className="font-heading fw-bold text-dark mb-0">HOD Executive Decision History Log</h6>
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
                  <option value="Approved">Approved by HOD</option>
                  <option value="Rejected">Rejected by HOD</option>
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
                  <th>Department</th>
                  <th>Reason</th>
                  <th>Teacher Approval</th>
                  <th>HOD Final Decision</th>
                  <th>Decision Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredProcessed.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No processed applications found matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProcessed.map(req => (
                    <tr key={req.id}>
                      <td className="ps-4">
                        <span className="fw-bold text-dark d-block">{req.studentName}</span>
                        <small className="text-muted font-monospace">{req.regNo}</small>
                      </td>
                      <td>{req.department}</td>
                      <td>
                        <small className="text-truncate d-block" style={{ maxWidth: '200px' }}>
                          {req.reason}
                        </small>
                      </td>
                      <td>
                        <StatusBadge status={req.teacherStatus} />
                      </td>
                      <td>
                        <StatusBadge status={req.hodStatus === 'Approved' ? 'Approved by HOD' : 'Rejected by HOD'} />
                      </td>
                      <td>
                        <small className="text-muted">{req.hodActionAt || 'Recently'}</small>
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

export default HodDashboard;
