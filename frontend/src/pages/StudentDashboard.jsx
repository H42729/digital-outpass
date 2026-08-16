import React, { useState, useEffect } from 'react';
import { useOutpass } from '../context/OutpassContext';
import StatusBadge from '../components/StatusBadge';
import ProgressStepper from '../components/ProgressStepper';
import OutpassFormModal from '../components/OutpassFormModal';
import OutpassGatePassModal from '../components/OutpassGatePassModal';

const StudentDashboard = () => {
  const { currentUser, requests, fetchRequests } = useOutpass();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGatepass, setSelectedGatepass] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Always fetch fresh data when the student dashboard mounts
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Requests are already filtered by studentId on the backend
  const displayRequests = requests;

  // Search & Filter implementation
  const filteredRequests = displayRequests.filter(req => {
    const matchesSearch = 
      req.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.date.includes(searchTerm) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'Pending') {
      return req.teacherStatus === 'Pending' || (req.teacherStatus === 'Approved' && req.hodStatus === 'Pending');
    }
    if (statusFilter === 'Approved') {
      return req.teacherStatus === 'Approved' && req.hodStatus === 'Approved';
    }
    if (statusFilter === 'Rejected') {
      return req.teacherStatus === 'Rejected' || req.hodStatus === 'Rejected';
    }

    return true;
  });

  // Latest active request for pipeline status
  const latestRequest = displayRequests[0];

  const approvedCount = displayRequests.filter(r => r.teacherStatus === 'Approved' && r.hodStatus === 'Approved').length;
  const pendingCount = displayRequests.filter(r => r.teacherStatus === 'Pending' || (r.teacherStatus === 'Approved' && r.hodStatus === 'Pending')).length;
  const rejectedCount = displayRequests.filter(r => r.teacherStatus === 'Rejected' || r.hodStatus === 'Rejected').length;

  // Determine active status stage text for the 7 stages requested
  const getDetailedStatusText = (req) => {
    if (!req) return 'Request Submitted';
    if (req.teacherStatus === 'Rejected') return 'Rejected by Class Teacher';
    if (req.teacherStatus === 'Pending') return 'Pending with Class Teacher';
    if (req.teacherStatus === 'Approved') {
      if (req.hodStatus === 'Rejected') return 'Rejected by HOD';
      if (req.hodStatus === 'Approved') return 'Approved by HOD';
      return 'Pending with HOD';
    }
    return 'Request Submitted';
  };

  return (
    <div className="container-fluid py-2">
      {/* Welcome Banner */}
      <div className="dash-card p-3 p-sm-4 mb-4 bg-white border-0 shadow-sm rounded-4 position-relative overflow-hidden">
        <div className="row align-items-center g-3">
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-1 rounded-pill">
                STUDENT PORTAL
              </span>
              <span className="text-muted small">• {currentUser?.department} ({currentUser?.year})</span>
            </div>
            <h2 className="fw-bold text-dark font-heading mb-1 fs-4 fs-sm-2">
              Welcome back, {currentUser?.name || 'Rahul Sharma'}! 👋
            </h2>
            <p className="text-secondary mb-0" style={{ fontSize: '0.9rem' }}>
              Submit and track your digital outpass requests online. Instant status updates as your Class Teacher and HOD review your application.
            </p>
          </div>

          <div className="col-lg-4 text-lg-end">
            <button 
              className="btn btn-primary-gradient btn-rounded w-100 w-lg-auto px-4 py-2.5 py-sm-3 shadow"
              onClick={() => setIsFormOpen(true)}
            >
              <i className="bi bi-file-earmark-plus-fill fs-5 me-2"></i> Apply Outpass
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Metrics Cards */}
      <div className="row g-2 g-sm-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="dash-card p-2.5 p-sm-3 d-flex align-items-center gap-2 gap-sm-3 overflow-hidden">
            <div className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '42px', height: '42px' }}>
              <i className="bi bi-file-earmark-text-fill fs-5"></i>
            </div>
            <div className="min-w-0 flex-grow-1">
              <small className="text-muted fw-bold text-uppercase d-block text-truncate" style={{ fontSize: '0.675rem' }}>Total Requests</small>
              <h3 className="fw-bold text-dark mb-0 fs-4 fs-sm-3">{displayRequests.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="dash-card p-2.5 p-sm-3 d-flex align-items-center gap-2 gap-sm-3 overflow-hidden">
            <div className="bg-warning-subtle text-warning rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '42px', height: '42px' }}>
              <i className="bi bi-hourglass-split fs-5"></i>
            </div>
            <div className="min-w-0 flex-grow-1">
              <small className="text-muted fw-bold text-uppercase d-block text-truncate" style={{ fontSize: '0.675rem' }}>Pending</small>
              <h3 className="fw-bold text-dark mb-0 fs-4 fs-sm-3">{pendingCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="dash-card p-2.5 p-sm-3 d-flex align-items-center gap-2 gap-sm-3 overflow-hidden">
            <div className="bg-success-subtle text-success rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '42px', height: '42px' }}>
              <i className="bi bi-patch-check-fill fs-5"></i>
            </div>
            <div className="min-w-0 flex-grow-1">
              <small className="text-muted fw-bold text-uppercase d-block text-truncate" style={{ fontSize: '0.675rem' }}>Approved</small>
              <h3 className="fw-bold text-dark mb-0 fs-4 fs-sm-3">{approvedCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="dash-card p-2.5 p-sm-3 d-flex align-items-center gap-2 gap-sm-3 overflow-hidden">
            <div className="bg-danger-subtle text-danger rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '42px', height: '42px' }}>
              <i className="bi bi-x-circle-fill fs-5"></i>
            </div>
            <div className="min-w-0 flex-grow-1">
              <small className="text-muted fw-bold text-uppercase d-block text-truncate" style={{ fontSize: '0.675rem' }}>Rejected</small>
              <h3 className="fw-bold text-dark mb-0 fs-4 fs-sm-3">{rejectedCount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Active Outpass Request Status & Approval Pipeline */}
      {latestRequest && (
        <div className="dash-card mb-4 border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="card-header bg-white py-3 px-3 px-sm-4 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-activity text-primary fs-4"></i>
              <h5 className="font-heading fw-bold text-dark mb-0 fs-6 fs-sm-5">Outpass Live Status Tracker</h5>
            </div>
            <span className="font-monospace fw-bold text-secondary bg-light px-3 py-1 rounded-pill small">
              ID: {latestRequest.id}
            </span>
          </div>

          <div className="card-body p-3 p-sm-4">
            {/* Live Overall Status Stage Alert */}
            <div className="p-3 mb-4 rounded-3 border d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3" style={{ backgroundColor: '#f8fafc' }}>
              <div>
                <small className="text-muted d-block fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>Current Application Status</small>
                <h5 className="fw-bold text-primary mb-0 fs-6 fs-sm-5">{getDetailedStatusText(latestRequest)}</h5>
              </div>

              {latestRequest.teacherStatus === 'Approved' && latestRequest.hodStatus === 'Approved' ? (
                <button 
                  className="btn btn-success btn-rounded shadow-sm px-4 w-100 w-sm-auto"
                  onClick={() => setSelectedGatepass(latestRequest)}
                >
                  <i className="bi bi-qr-code-scan me-1"></i> View Gate Pass
                </button>
              ) : (
                <span className="badge bg-secondary-subtle text-secondary px-3 py-2">
                  <i className="bi bi-arrow-repeat me-1"></i> Processing Workflow
                </span>
              )}
            </div>

            {/* Visual Stepper */}
            <div className="my-3">
              <h6 className="fw-bold text-dark font-heading mb-3">Workflow Pipeline</h6>
              <ProgressStepper 
                teacherStatus={latestRequest.teacherStatus} 
                hodStatus={latestRequest.hodStatus} 
              />
            </div>

            {/* Application Summary */}
            <div className="mt-4 pt-3 border-top">
              <div className="row g-3 text-muted small">
                <div className="col-6 col-md-3">
                  <strong>Department:</strong> <span className="text-dark fw-semibold d-block text-truncate">{latestRequest.department}</span>
                </div>
                <div className="col-6 col-md-3">
                  <strong>Class Teacher:</strong> <span className="text-dark fw-semibold d-block text-truncate">{latestRequest.teacherName}</span>
                </div>
                <div className="col-6 col-md-3">
                  <strong>Out Date & Timing:</strong> <span className="text-dark fw-semibold d-block">{latestRequest.date} ({latestRequest.outTime} → {latestRequest.expectedReturnTime})</span>
                </div>
                <div className="col-6 col-md-3">
                  <strong>Reason:</strong> <span className="text-dark fw-semibold d-block text-truncate">{latestRequest.reason}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Outpass Requests Log with Search & Filter */}
      <div className="dash-card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white py-3 px-3 px-sm-4 border-bottom">
          <div className="row align-items-center g-2 g-sm-3">
            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-journal-text text-primary fs-4"></i>
                <h5 className="font-heading fw-bold text-dark mb-0 fs-6 fs-sm-5">My Applications Log</h5>
              </div>
            </div>

            {/* Search Input */}
            <div className="col-12 col-sm-7 col-md-5">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control form-control-sm bg-light border-start-0"
                  placeholder="Search by reason, teacher, ID or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="col-12 col-sm-5 col-md-3 text-sm-end">
              <div className="d-flex align-items-center justify-content-sm-end gap-2">
                <small className="text-muted fw-semibold">Filter:</small>
                <select
                  className="form-select form-select-sm w-auto rounded-3"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Requests</option>
                  <option value="Pending">Pending</option>
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
                  <th className="ps-4">Outpass ID</th>
                  <th>Reason</th>
                  <th>Date & Time</th>
                  <th>Class Teacher Status</th>
                  <th>HOD Status</th>
                  <th>Detailed Status</th>
                  <th className="pe-4 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No matching outpass requests found.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="ps-4">
                        <span className="fw-bold text-primary font-monospace">{req.id}</span>
                        <small className="d-block text-muted">{req.department}</small>
                        <small className="d-block text-black-50">{req.appliedAt}</small>
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '200px' }}>
                          {req.reason}
                        </div>
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
                      <td>
                        <span className="fw-semibold text-secondary small">
                          {getDetailedStatusText(req)}
                        </span>
                      </td>
                      <td className="pe-4 text-end">
                        {req.teacherStatus === 'Approved' && req.hodStatus === 'Approved' ? (
                          <button 
                            className="btn btn-sm btn-outline-success btn-rounded"
                            onClick={() => setSelectedGatepass(req)}
                          >
                            <i className="bi bi-qr-code me-1"></i> Pass
                          </button>
                        ) : (
                          <button 
                            className="btn btn-sm btn-light border text-secondary btn-rounded"
                            onClick={() => setSelectedGatepass(req)}
                          >
                            Details
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Outpass Form Modal */}
      <OutpassFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />

      {/* Printable Gatepass Modal */}
      <OutpassGatePassModal 
        outpass={selectedGatepass} 
        isOpen={!!selectedGatepass} 
        onClose={() => setSelectedGatepass(null)} 
      />
    </div>
  );
};

export default StudentDashboard;
