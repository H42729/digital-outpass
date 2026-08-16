import React, { useState, useEffect } from 'react';
import { useOutpass } from '../context/OutpassContext';
import { DEPARTMENTS } from '../data/constants';

const OutpassFormModal = ({ isOpen, onClose }) => {
  const { currentUser, addRequest } = useOutpass();

  const [formData, setFormData] = useState({
    studentName: '',
    regNo: '',
    department: '',
    year: '3rd Year',
    teacherName: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
    outTime: '10:00 AM',
    expectedReturnTime: '05:00 PM'
  });

  const [validated, setValidated] = useState(false);

  // Pre-fill form from currentUser whenever modal opens
  useEffect(() => {
    if (isOpen && currentUser) {
      // Check if user department matches one of the preset options
      const matchedDept = DEPARTMENTS.includes(currentUser.department) 
        ? currentUser.department 
        : (currentUser.department || '');

      setFormData({
        studentName: currentUser.name || '',
        regNo: currentUser.regNo || '',
        department: matchedDept,
        year: currentUser.year || '',
        teacherName: currentUser.teacherName || '',
        reason: '',
        date: new Date().toISOString().split('T')[0],
        outTime: '',
        expectedReturnTime: ''
      });
      setValidated(false);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.department ||
      !formData.studentName ||
      !formData.regNo ||
      !formData.reason ||
      !formData.date ||
      !formData.outTime ||
      !formData.expectedReturnTime
    ) {
      setValidated(true);
      return;
    }

    addRequest(formData);
    onClose();
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden" style={{ maxHeight: '90vh' }}>
          {/* Header */}
          <div className="modal-header bg-primary text-white py-3 px-3 px-md-4">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-file-earmark-plus-fill fs-4"></i>
              <div>
                <h5 className="modal-title font-heading fw-bold mb-0 fs-6 fs-md-5">Apply for Digital Outpass</h5>
                <small className="opacity-75 d-none d-sm-block" style={{ fontSize: '0.75rem' }}>Submit leave request for Class Teacher & HOD approval</small>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className={`d-flex flex-column flex-grow-1 overflow-hidden ${validated ? 'was-validated' : ''}`} noValidate>
            <div className="modal-body p-3 p-md-4 overflow-y-auto">
              <div className="alert alert-info border-0 rounded-3 mb-3 mb-md-4 d-flex align-items-center gap-2" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>
                <i className="bi bi-info-circle-fill fs-5 flex-shrink-0"></i>
                <small style={{ fontSize: '0.775rem' }}>
                  Once submitted, your request status will update automatically in real-time as your Class Teacher and HOD review your outpass.
                </small>
              </div>

              <div className="row g-3">
                {/* Student Name */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    Student Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">Please enter student name.</div>
                </div>

                {/* Register Number */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    Register Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    name="regNo"
                    value={formData.regNo}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">Please enter register number.</div>
                </div>

                {/* Department Dropdown */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    Department <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select rounded-3"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">Please select your department.</div>
                </div>

                {/* Year */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    Year <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select rounded-3"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                  <div className="invalid-feedback">Please select year.</div>
                </div>

                {/* Class Teacher Name */}
                <div className="col-md-12">
                  <label className="form-label fw-semibold text-dark">
                    Class Teacher Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    name="teacherName"
                    value={formData.teacherName}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">Please enter class teacher name.</div>
                </div>

                {/* Reason for Leaving */}
                <div className="col-md-12">
                  <label className="form-label fw-semibold text-dark">
                    Reason for Outpass <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control rounded-3"
                    name="reason"
                    rows="3"
                    placeholder="Provide valid medical, academic, or personal reason..."
                    value={formData.reason}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <div className="invalid-feedback">Please enter a valid reason for leaving.</div>
                </div>

                {/* Date */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-dark">
                    Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control rounded-3"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">Select date.</div>
                </div>

                {/* Out Time */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-dark">
                    Out Time <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    name="outTime"
                    placeholder="e.g. 10:30 AM"
                    value={formData.outTime}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">Specify out time.</div>
                </div>

                {/* Expected Return Time */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-dark">
                    Expected Return Time <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    name="expectedReturnTime"
                    placeholder="e.g. 05:30 PM"
                    value={formData.expectedReturnTime}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">Specify expected return time.</div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="modal-footer bg-light px-3 px-md-4 py-2.5 flex-column flex-sm-row gap-2 border-top">
              <button 
                type="button" 
                className="btn btn-outline-secondary btn-rounded w-100 w-sm-auto order-2 order-sm-1" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary-gradient btn-rounded shadow-sm w-100 w-sm-auto order-1 order-sm-2"
              >
                <i className="bi bi-send-fill me-1"></i> Submit Outpass Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OutpassFormModal;
