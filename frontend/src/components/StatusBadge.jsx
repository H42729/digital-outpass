import React from 'react';

const StatusBadge = ({ status }) => {
  const text = status || 'Pending';
  const normalized = text.toLowerCase();

  if (normalized.includes('approved')) {
    return (
      <span className="badge bg-success-subtle text-success border border-success-subtle fw-semibold px-3 py-1 rounded-pill d-inline-flex align-items-center gap-1">
        <i className="bi bi-check-circle-fill"></i> {text}
      </span>
    );
  }

  if (normalized.includes('rejected')) {
    return (
      <span className="badge bg-danger-subtle text-danger border border-danger-subtle fw-semibold px-3 py-1 rounded-pill d-inline-flex align-items-center gap-1">
        <i className="bi bi-x-circle-fill"></i> {text}
      </span>
    );
  }

  return (
    <span className="badge bg-warning-subtle text-warning border border-warning-subtle fw-semibold px-3 py-1 rounded-pill d-inline-flex align-items-center gap-1">
      <i className="bi bi-hourglass-split"></i> {text}
    </span>
  );
};

export default StatusBadge;

