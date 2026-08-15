import React from 'react';
import { COLLEGE_INFO } from '../data/constants';

const OutpassGatePassModal = ({ outpass, isOpen, onClose }) => {
  if (!isOpen || !outpass) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(5px)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          <div className="modal-header bg-success text-white py-3 px-4">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-qr-code-scan fs-4"></i>
              <h5 className="modal-title font-heading fw-bold mb-0">Official Digital Gate Pass</h5>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4 bg-light">
            <div className="gatepass-paper shadow-sm">
              <div className="watermark">APPROVED</div>

              {/* College Header */}
              <div className="text-center pb-3 mb-3 border-bottom">
                <img src={COLLEGE_INFO.logo} alt="Logo" width="48" className="mb-1" />
                <h6 className="fw-bold mb-0 text-dark">{COLLEGE_INFO.name}</h6>
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>Campus Gate Pass Security Slip</small>
              </div>

              {/* Pass ID & Status */}
              <div className="d-flex justify-content-between align-items-center mb-3 bg-light p-2 rounded-3">
                <div>
                  <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>PASS REFERENCE ID</small>
                  <span className="fw-bold text-primary font-monospace">{outpass.id}</span>
                </div>
                <span className="badge bg-success-subtle text-success border border-success fw-bold px-3 py-1">
                  <i className="bi bi-check-circle-fill me-1"></i> VERIFIED APPROVED
                </span>
              </div>

              {/* Student Details Grid */}
              <div className="row g-2 mb-3" style={{ fontSize: '0.875rem' }}>
                <div className="col-6">
                  <small className="text-muted d-block">Student Name</small>
                  <span className="fw-bold text-dark">{outpass.studentName}</span>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block">Register Number</small>
                  <span className="fw-bold text-dark">{outpass.regNo}</span>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block">Department & Year</small>
                  <span className="fw-bold text-dark">{outpass.department} ({outpass.year})</span>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block">Class Teacher</small>
                  <span className="fw-semibold text-dark">{outpass.teacherName}</span>
                </div>
              </div>

              {/* Timing Box */}
              <div className="bg-primary-subtle text-primary p-3 rounded-3 mb-3 border border-primary-subtle">
                <div className="row text-center">
                  <div className="col-4 border-end border-primary-subtle">
                    <small className="d-block text-uppercase fw-semibold" style={{ fontSize: '0.65rem' }}>Leave Date</small>
                    <strong style={{ fontSize: '0.85rem' }}>{outpass.date}</strong>
                  </div>
                  <div className="col-4 border-end border-primary-subtle">
                    <small className="d-block text-uppercase fw-semibold" style={{ fontSize: '0.65rem' }}>Out Time</small>
                    <strong style={{ fontSize: '0.85rem' }}>{outpass.outTime}</strong>
                  </div>
                  <div className="col-4">
                    <small className="d-block text-uppercase fw-semibold" style={{ fontSize: '0.65rem' }}>Return Time</small>
                    <strong style={{ fontSize: '0.85rem' }}>{outpass.expectedReturnTime}</strong>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="mb-3">
                <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Reason for Leaving</small>
                <p className="mb-0 text-dark small fst-italic">{outpass.reason}</p>
              </div>

              {/* QR Code & Signatures */}
              <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                <div className="text-center">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=OUTPASS_APPROVED_${outpass.id}_${outpass.regNo}`} 
                    alt="QR Pass Verification"
                    className="border p-1 bg-white rounded"
                  />
                  <small className="d-block text-muted" style={{ fontSize: '0.65rem' }}>Scan at Main Gate</small>
                </div>
                <div className="text-end">
                  <div className="text-success fw-bold small">
                    <i className="bi bi-shield-check me-1"></i> Class Teacher Approved
                  </div>
                  <div className="text-success fw-bold small">
                    <i className="bi bi-shield-check me-1"></i> HOD Approved
                  </div>
                  <small className="text-muted" style={{ fontSize: '0.65rem' }}>Verified on {outpass.hodActionAt || outpass.appliedAt}</small>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer bg-white py-3 px-4">
            <button className="btn btn-outline-secondary btn-rounded" onClick={onClose}>Close</button>
            <button className="btn btn-primary-gradient btn-rounded" onClick={handlePrint}>
              <i className="bi bi-printer-fill me-1"></i> Print / Download Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutpassGatePassModal;
