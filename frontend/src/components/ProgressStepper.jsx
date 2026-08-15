import React from 'react';

const ProgressStepper = ({ teacherStatus = 'Pending', hodStatus = 'Pending' }) => {
  const isTeacherApproved = teacherStatus === 'Approved';
  const isTeacherRejected = teacherStatus === 'Rejected';

  const isHodApproved = hodStatus === 'Approved';
  const isHodRejected = hodStatus === 'Rejected';

  const isAnyRejected = isTeacherRejected || isHodRejected;

  // Calculate active step index (0 to 3)
  let activeStep = 0;
  if (!isAnyRejected) {
    if (!isTeacherApproved) {
      activeStep = 1; // Waiting for Class Teacher
    } else if (isTeacherApproved && !isHodApproved) {
      activeStep = 2; // Waiting for HOD
    } else if (isTeacherApproved && isHodApproved) {
      activeStep = 3; // Approved
    }
  }

  // Calculate progress bar fill percentage
  let progressWidth = '0%';
  if (isAnyRejected) {
    if (isTeacherRejected) progressWidth = '33%';
    else if (isHodRejected) progressWidth = '66%';
  } else {
    if (activeStep === 1) progressWidth = '33%';
    if (activeStep === 2) progressWidth = '66%';
    if (activeStep === 3) progressWidth = '100%';
  }

  const steps = [
    {
      id: 1,
      title: 'Request Submitted',
      subtitle: 'Student Submission',
      icon: 'bi-send-check',
      isCompleted: true,
      isActive: activeStep === 0
    },
    {
      id: 2,
      title: 'Class Teacher Approval',
      subtitle: isTeacherRejected ? 'Rejected by Teacher' : isTeacherApproved ? 'Approved by Teacher' : 'Waiting for Approval',
      icon: isTeacherRejected ? 'bi-x-circle' : isTeacherApproved ? 'bi-check2-circle' : 'bi-person-badge',
      isCompleted: isTeacherApproved,
      isActive: activeStep === 1 && !isTeacherRejected,
      isRejected: isTeacherRejected
    },
    {
      id: 3,
      title: 'HOD Approval',
      subtitle: isHodRejected ? 'Rejected by HOD' : isHodApproved ? 'Approved by HOD' : 'Waiting for Approval',
      icon: isHodRejected ? 'bi-x-circle' : isHodApproved ? 'bi-shield-check' : 'bi-person-workspace',
      isCompleted: isHodApproved,
      isActive: activeStep === 2 && !isHodRejected,
      isRejected: isHodRejected
    },
    {
      id: 4,
      title: isAnyRejected ? 'Outpass Rejected' : 'Outpass Approved',
      subtitle: isAnyRejected ? 'Request Declined' : isHodApproved ? 'Ready for Gate Exit' : 'Pending Approvals',
      icon: isAnyRejected ? 'bi-x-diamond' : isHodApproved ? 'bi-qr-code-scan' : 'bi-clock-history',
      isCompleted: isHodApproved,
      isActive: activeStep === 3,
      isRejected: isAnyRejected
    }
  ];

  return (
    <div className="stepper-container">
      <div className="stepper-track">
        <div 
          className="stepper-progress-line" 
          style={{ 
            width: progressWidth,
            background: isAnyRejected ? '#dc2626' : undefined
          }}
        ></div>

        {steps.map((step) => {
          let stepStateClass = '';
          if (step.isRejected) stepStateClass = 'rejected';
          else if (step.isCompleted) stepStateClass = 'completed';
          else if (step.isActive) stepStateClass = 'active';

          return (
            <div key={step.id} className={`stepper-step ${stepStateClass}`}>
              <div className="step-icon-bubble">
                <i className={`bi ${step.icon}`}></i>
              </div>
              <div className="step-title">{step.title}</div>
              <div className="step-subtitle">{step.subtitle}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;
