import React from 'react';
import { COLLEGE_INFO } from '../data/constants';

const OutpassGatePassModal = ({ outpass, isOpen, onClose }) => {
  if (!isOpen || !outpass) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(5px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden" style={{ maxHeight: '90vh' }}>
          <div className="modal-header bg-success text-white py-3 px-3 px-md-4">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-qr-code-scan fs-4"></i>
              <h5 className="modal-title font-heading fw-bold mb-0 fs-6 fs-md-5">Official Digital Gate Pass</h5>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-3 p-md-4 bg-light overflow-y-auto">
            <div className="gatepass-paper shadow-sm p-3 p-md-4">
              <div className="watermark">APPROVED</div>

              {/* College Header */}
              <div className="text-center pb-3 mb-3 border-bottom">
                <img src={COLLEGE_INFO.logo} alt="Logo" width="44" className="mb-1" />
                <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.9rem' }}>{COLLEGE_INFO.name}</h6>
                <small className="text-muted" style={{ fontSize: '0.725rem' }}>Campus Gate Pass Security Slip</small>
              </div>

              {/* Pass ID & Status */}
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 bg-light p-2 rounded-3">
                <div>
                  <small className="text-muted d-block" style={{ fontSize: '0.68rem' }}>PASS REFERENCE ID</small>
                  <span className="fw-bold text-primary font-monospace" style={{ fontSize: '0.85rem' }}>{outpass.id}</span>
                </div>
                <span className="badge bg-success-subtle text-success border border-success fw-bold px-2.5 py-1" style={{ fontSize: '0.75rem' }}>
                  <i className="bi bi-check-circle-fill me-1"></i> VERIFIED APPROVED
                </span>
              </div>

              {/* Student Details Grid */}
              <div className="row g-2 mb-3" style={{ fontSize: '0.85rem' }}>
                <div className="col-6">
                  <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Student Name</small>
                  <span className="fw-bold text-dark text-truncate d-block">{outpass.studentName}</span>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Register Number</small>
                  <span className="fw-bold text-dark font-monospace text-truncate d-block">{outpass.regNo}</span>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Department & Year</small>
                  <span className="fw-bold text-dark text-truncate d-block">{outpass.department} ({outpass.year})</span>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Class Teacher</small>
                  <span className="fw-semibold text-dark text-truncate d-block">{outpass.teacherName}</span>
                </div>
              </div>

              {/* Timing Box */}
              <div className="bg-primary-subtle text-primary p-2.5 p-md-3 rounded-3 mb-3 border border-primary-subtle">
                <div className="row text-center g-1">
                  <div className="col-4 border-end border-primary-subtle">
                    <small className="d-block text-uppercase fw-semibold" style={{ fontSize: '0.6rem' }}>Leave Date</small>
                    <strong style={{ fontSize: '0.78rem' }}>{outpass.date}</strong>
                  </div>
                  <div className="col-4 border-end border-primary-subtle">
                    <small className="d-block text-uppercase fw-semibold" style={{ fontSize: '0.6rem' }}>Out Time</small>
                    <strong style={{ fontSize: '0.78rem' }}>{outpass.outTime}</strong>
                  </div>
                  <div className="col-4">
                    <small className="d-block text-uppercase fw-semibold" style={{ fontSize: '0.6rem' }}>Return Time</small>
                    <strong style={{ fontSize: '0.78rem' }}>{outpass.expectedReturnTime}</strong>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="mb-3">
                <small className="text-muted d-block" style={{ fontSize: '0.725rem' }}>Reason for Leaving</small>
                <p className="mb-0 text-dark small fst-italic">{outpass.reason}</p>
              </div>

              {/* QR Code & Signatures */}
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 pt-3 border-top">
                <div className="text-center mx-auto mx-sm-0">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=65x65&data=OUTPASS_APPROVED_${outpass.id}_${outpass.regNo}`} 
                    alt="QR Pass Verification"
                    className="border p-1 bg-white rounded"
                  />
                  <small className="d-block text-muted" style={{ fontSize: '0.625rem' }}>Scan at Main Gate</small>
                </div>
                <div className="text-center text-sm-end mx-auto mx-sm-0">
                  <div className="text-success fw-bold small" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-shield-check me-1"></i> Class Teacher Approved
                  </div>
                  <div className="text-success fw-bold small" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-shield-check me-1"></i> HOD Approved
                  </div>
                  <small className="text-muted" style={{ fontSize: '0.625rem' }}>Verified on {outpass.hodActionAt || outpass.appliedAt}</small>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer bg-white py-2.5 px-3 px-md-4 flex-column flex-sm-row gap-2">
            <button className="btn btn-outline-secondary btn-rounded w-100 w-sm-auto mb-1 mb-sm-0" onClick={onClose}>Close</button>
            <button className="btn btn-primary-gradient btn-rounded w-100 w-sm-auto" onClick={handlePrint}>
              <i className="bi bi-printer-fill me-1"></i> Print / Download Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutpassGatePassModal;
