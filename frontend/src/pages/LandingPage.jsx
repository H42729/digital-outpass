import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { COLLEGE_INFO } from '../data/constants';

const featureList = [
  {
    category: 'STUDENT MOBILITY',
    icon: 'bi-lightning-charge-fill',
    title: 'Instant Application Workflow',
    desc: 'Students can request campus exit permissions in under 30 seconds with complete digital reason logging and return time estimates.',
    accent: '#2563eb',
    bgLight: 'rgba(37, 99, 235, 0.08)'
  },
  {
    category: 'TWO-TIER APPROVAL',
    icon: 'bi-shield-check',
    title: 'Dual-Stage Governance',
    desc: 'Sequential review system requiring Class Teacher verification followed by Department HOD executive sign-off.',
    accent: '#16a34a',
    bgLight: 'rgba(22, 163, 74, 0.08)'
  },
  {
    category: 'SECURITY & GATEWAY',
    icon: 'bi-qr-code-scan',
    title: 'Dynamic QR Gate Pass',
    desc: 'Automated generation of tamper-evident digital gate passes equipped with security verification stamps for campus security personnel.',
    accent: '#7c3aed',
    bgLight: 'rgba(124, 58, 237, 0.08)'
  },
  {
    category: 'REAL-TIME TRACKING',
    icon: 'bi-broadcast',
    title: 'Live Approval Pipeline',
    desc: 'Instant visual status tracking allowing students and staff to monitor application progress across all authorization stages.',
    accent: '#0891b2',
    bgLight: 'rgba(8, 145, 178, 0.08)'
  },
  {
    category: 'AUDIT & COMPLIANCE',
    icon: 'bi-journal-check',
    title: 'Automated Record Keeping',
    desc: 'Complete digital historical archives for institutional auditing, department reporting, and security compliance verification.',
    accent: '#d97706',
    bgLight: 'rgba(217, 119, 6, 0.08)'
  },
  {
    category: 'SYSTEM INTEGRATION',
    icon: 'bi-cpu-fill',
    title: 'Relational Database Integrity',
    desc: 'Direct synchronization with backend databases ensuring data integrity, strict user role segregation, and reliable record storage.',
    accent: '#4f46e5',
    bgLight: 'rgba(79, 70, 229, 0.08)'
  }
];

const workflowSteps = [
  {
    step: '01',
    role: 'Student Submission',
    title: 'Submit Outpass Details',
    desc: 'Student inputs exit reason, destination, departure date, and expected return time.',
    icon: 'bi-pencil-square',
    badge: 'Step 1'
  },
  {
    step: '02',
    role: 'Teacher Review',
    title: 'Class Teacher Endorsement',
    desc: 'Assigned Class Teacher validates student attendance and forwards approved request to HOD.',
    icon: 'bi-person-check-fill',
    badge: 'Step 2'
  },
  {
    step: '03',
    role: 'Executive Sign-off',
    title: 'HOD Final Authorization',
    desc: 'Department Head grants final digital sign-off and activates the official outpass status.',
    icon: 'bi-shield-lock-fill',
    badge: 'Step 3'
  },
  {
    step: '04',
    role: 'Gate Verification',
    title: 'Digital Gate Pass Active',
    desc: 'Student presents digital QR gate pass to security personnel for seamless exit clearance.',
    icon: 'bi-qr-code',
    badge: 'Step 4'
  }
];

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="pro-landing light-theme">

      {/* ── Navbar ── */}
      <nav className={`pro-navbar ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container-fluid px-3 px-md-4 d-flex align-items-center justify-content-between">
          <Link to="/" className="pro-brand d-flex align-items-center gap-2 gap-md-3 text-decoration-none">
            <img src={COLLEGE_INFO.logo} alt="Apex Logo" className="pro-brand-logo" />
            <div className="pro-brand-text">
              <span className="pro-brand-title">{COLLEGE_INFO.name}</span>
              <span className="pro-brand-subtitle">Digital Outpass Management System</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="pro-nav-links d-none d-md-flex align-items-center gap-4">
            <a href="#overview" className="pro-nav-item">Overview</a>
            <a href="#features" className="pro-nav-item">Features</a>
            <a href="#workflow" className="pro-nav-item">Approval Workflow</a>
            <a href="#portals" className="pro-nav-item">Portals</a>
            <Link to="/login" className="btn btn-primary btn-sm btn-rounded px-3 py-1.5 fw-bold ms-2">
              Select Role <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="d-flex align-items-center gap-2 d-md-none">
            <Link to="/login" className="btn btn-primary btn-sm btn-rounded px-2.5 py-1 text-nowrap fw-bold" style={{ fontSize: '0.75rem' }}>
              Select Role
            </Link>
            <button
              className="btn btn-light btn-sm border-0 p-1 text-dark"
              onClick={() => setMobileNavOpen(prev => !prev)}
              aria-label="Toggle Navigation"
            >
              <i className={`bi ${mobileNavOpen ? 'bi-x-lg' : 'bi-list'} fs-4`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav Drawer */}
        {mobileNavOpen && (
          <div className="bg-white border-top border-bottom py-3 px-4 d-md-none animate-fadeIn">
            <div className="d-flex flex-column gap-2 mb-3">
              <a href="#overview" className="pro-nav-item py-1.5 border-bottom" onClick={() => setMobileNavOpen(false)}>Overview</a>
              <a href="#features" className="pro-nav-item py-1.5 border-bottom" onClick={() => setMobileNavOpen(false)}>Features</a>
              <a href="#workflow" className="pro-nav-item py-1.5 border-bottom" onClick={() => setMobileNavOpen(false)}>Approval Workflow</a>
              <a href="#portals" className="pro-nav-item py-1.5" onClick={() => setMobileNavOpen(false)}>Portals</a>
            </div>
            <div className="d-flex flex-column gap-2">
              <Link to="/login/student" className="btn btn-primary btn-sm btn-rounded text-start px-3 py-2" onClick={() => setMobileNavOpen(false)}>
                <i className="bi bi-mortarboard-fill me-2"></i> Student Login
              </Link>
              <Link to="/login/teacher" className="btn btn-success btn-sm btn-rounded text-start px-3 py-2" onClick={() => setMobileNavOpen(false)}>
                <i className="bi bi-person-badge-fill me-2"></i> Teacher Login
              </Link>
              <Link to="/login/hod" className="btn btn-dark btn-sm btn-rounded text-start px-3 py-2" onClick={() => setMobileNavOpen(false)}>
                <i className="bi bi-shield-lock-fill me-2"></i> HOD Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero Section (Light Unique Theme) ── */}
      <section className="pro-hero light-hero" id="overview">
        <div className="pro-hero-overlay"></div>
        <div className="container-fluid px-4 px-lg-5 position-relative">
          <div className="row align-items-center min-vh-80 py-5">
            <div className="col-lg-6 mb-5 mb-lg-0">
              
              {/* Badge */}
              <div className="pro-badge-pill mb-3 d-inline-flex align-items-center gap-2">
                <span className="badge bg-primary text-white rounded-pill px-2.5 py-1">OFFICIAL PORTAL</span>
                <span className="text-secondary small fw-semibold">Smart Campus Outpass Security System</span>
              </div>

              <h1 className="pro-hero-title mb-3 text-dark">
                Automated Outpass Governance <br />
                <span className="pro-gradient-text">Fast, Secure & Paperless</span>
              </h1>

              <p className="pro-hero-lead mb-4 text-secondary">
                Streamlining student leave permissions, class teacher recommendations, and HOD executive approvals through a unified, real-time digital management portal.
              </p>

              {/* Stats Highlights */}
              <div className="row g-3 pro-hero-stats border-top border-slate-200 pt-4 mt-4">
                <div className="col-4">
                  <div className="pro-stat-item">
                    <h3 className="pro-stat-num text-primary mb-0">100%</h3>
                    <span className="pro-stat-desc text-muted fw-medium">Digital Workflow</span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="pro-stat-item border-start border-slate-200 ps-3">
                    <h3 className="pro-stat-num text-primary mb-0">2-Tier</h3>
                    <span className="pro-stat-desc text-muted fw-medium">Teacher & HOD Sign-off</span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="pro-stat-item border-start border-slate-200 ps-3">
                    <h3 className="pro-stat-num text-primary mb-0">Realtime</h3>
                    <span className="pro-stat-desc text-muted fw-medium">Gate Verification</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Live Mockup Card */}
            <div className="col-lg-6">
              <div className="pro-hero-mockup-wrapper">
                <div className="pro-mockup-card p-4 rounded-4 shadow-xl bg-white border">
                  
                  {/* Card Header */}
                  <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-success text-white rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
                        <i className="bi bi-shield-check fs-6"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-0 font-heading" style={{ fontSize: '0.95rem' }}>Apex Outpass Certificate</h6>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>Live System Preview Demo</small>
                      </div>
                    </div>
                    <span className="badge bg-success-subtle text-success fw-bold px-3 py-1 rounded-pill small">
                      <i className="bi bi-check-circle-fill me-1"></i> VERIFIED PASS
                    </span>
                  </div>

                  {/* Student Info Row */}
                  <div className="row g-2 mb-3 bg-light p-3 rounded-3">
                    <div className="col-6">
                      <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>STUDENT NAME</small>
                      <strong className="text-dark font-heading" style={{ fontSize: '0.85rem' }}>Arjun Kumar</strong>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>REGISTRATION NO</small>
                      <strong className="text-primary font-monospace" style={{ fontSize: '0.85rem' }}>AITS2024001</strong>
                    </div>
                    <div className="col-6 mt-2">
                      <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>DEPARTMENT</small>
                      <span className="text-dark fw-medium" style={{ fontSize: '0.8rem' }}>Computer Science</span>
                    </div>
                    <div className="col-6 mt-2">
                      <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>CLASS TEACHER</small>
                      <span className="text-dark fw-medium" style={{ fontSize: '0.8rem' }}>Prof. Meena Sharma</span>
                    </div>
                  </div>

                  {/* Approval Pipeline Stepper Preview */}
                  <div className="pro-demo-stepper mb-3 p-3 bg-white border rounded-3">
                    <small className="text-muted fw-bold d-block mb-2 text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}>Approval Status Pipeline</small>
                    <div className="d-flex align-items-center justify-content-between position-relative">
                      
                      <div className="text-center z-1">
                        <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1" style={{ width: '32px', height: '32px' }}>
                          <i className="bi bi-check-lg"></i>
                        </div>
                        <small className="fw-bold text-dark d-block" style={{ fontSize: '0.7rem' }}>Submitted</small>
                        <span className="text-muted" style={{ fontSize: '0.65rem' }}>09:30 AM</span>
                      </div>

                      <div className="flex-grow-1 bg-success" style={{ height: '3px', marginTop: '-14px' }}></div>

                      <div className="text-center z-1">
                        <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1" style={{ width: '32px', height: '32px' }}>
                          <i className="bi bi-check-lg"></i>
                        </div>
                        <small className="fw-bold text-dark d-block" style={{ fontSize: '0.7rem' }}>Teacher Approved</small>
                        <span className="text-muted" style={{ fontSize: '0.65rem' }}>10:15 AM</span>
                      </div>

                      <div className="flex-grow-1 bg-success" style={{ height: '3px', marginTop: '-14px' }}></div>

                      <div className="text-center z-1">
                        <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1" style={{ width: '32px', height: '32px', boxShadow: '0 0 10px rgba(22,163,74,0.4)' }}>
                          <i className="bi bi-shield-check"></i>
                        </div>
                        <small className="fw-bold text-success d-block" style={{ fontSize: '0.7rem' }}>HOD Signed</small>
                        <span className="text-success fw-bold" style={{ fontSize: '0.65rem' }}>Completed</span>
                      </div>

                    </div>
                  </div>

                  {/* QR Pass Preview footer */}
                  <div className="d-flex align-items-center justify-content-between p-2 px-3 bg-primary-subtle text-primary rounded-3">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-qr-code fs-3"></i>
                      <div>
                        <small className="fw-bold d-block" style={{ fontSize: '0.75rem' }}>Gate Pass Active</small>
                        <span className="small text-muted" style={{ fontSize: '0.68rem' }}>Valid for Gate Verification</span>
                      </div>
                    </div>
                    <span className="badge bg-primary px-3 py-2 rounded-pill font-monospace small">PASS #OP-8821</span>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key System Features ── */}
      <section className="py-5 bg-white border-top border-bottom" id="features">
        <div className="container-fluid px-4 px-lg-5 py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill text-uppercase mb-2" style={{ letterSpacing: '0.8px', fontSize: '0.75rem' }}>
              Institutional Governance
            </span>
            <h2 className="fw-bold text-dark font-heading display-6 mb-2">Designed for Institutional Efficiency</h2>
            <p className="text-secondary">
              A comprehensive paperless infrastructure providing strict permission controls, rapid authorization loops, and security auditing for Apex Digital Outpass System.
            </p>
          </div>

          <div className="row g-4">
            {featureList.map((item, idx) => (
              <div className="col-md-6 col-lg-4" key={idx}>
                <div className="pro-feature-card h-100 p-4 bg-light rounded-4 border shadow-sm transition-all hover-lift">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="pro-feature-icon rounded-3 p-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: item.bgLight, color: item.accent, width: '52px', height: '52px' }}>
                      <i className={`bi ${item.icon} fs-4`}></i>
                    </div>
                    <span className="text-muted fw-bold font-monospace" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>{item.category}</span>
                  </div>
                  <h5 className="fw-bold text-dark font-heading mb-2">{item.title}</h5>
                  <p className="text-secondary small mb-0 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow Pipeline ── */}
      <section className="py-5 bg-light" id="workflow">
        <div className="container-fluid px-4 px-lg-5 py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="badge bg-success-subtle text-success fw-bold px-3 py-2 rounded-pill text-uppercase mb-2" style={{ letterSpacing: '0.8px', fontSize: '0.75rem' }}>
              Standardized Process
            </span>
            <h2 className="fw-bold text-dark font-heading display-6 mb-2">4-Step Outpass Authorization Flow</h2>
            <p className="text-secondary">
              How students, class teachers, and heads of department interact within the system to issue verified digital outpasses.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {workflowSteps.map((ws, i) => (
              <div className="col-sm-6 col-lg-3" key={i}>
                <div className="pro-workflow-card p-4 rounded-4 bg-white border h-100 position-relative shadow-sm">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge bg-primary text-white rounded-pill px-3 py-1 font-monospace small">{ws.badge}</span>
                    <span className="fw-bold font-heading display-6 text-primary opacity-25">{ws.step}</span>
                  </div>
                  <div className="mb-3 text-primary">
                    <i className={`bi ${ws.icon} display-5`}></i>
                  </div>
                  <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: '0.7rem' }}>{ws.role}</small>
                  <h6 className="fw-bold text-dark font-heading mb-2">{ws.title}</h6>
                  <p className="text-secondary small mb-0">{ws.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role Portal Selector ── */}
      <section className="py-5 bg-white border-top" id="portals">
        <div className="container-fluid px-4 px-lg-5 py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill text-uppercase mb-2" style={{ letterSpacing: '0.8px', fontSize: '0.75rem' }}>
              Role-Based Access
            </span>
            <h2 className="fw-bold text-dark font-heading display-6 mb-2">Dedicated Institutional Portals</h2>
            <p className="text-secondary">Select your specific organizational role to sign in to your custom dashboard environment.</p>
          </div>

          <div className="row g-4 justify-content-center">
            
            {/* Student Card */}
            <div className="col-md-4">
              <div className="card border-0 rounded-4 shadow-sm h-100 p-4 bg-light border d-flex flex-column justify-content-between hover-lift">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="bg-primary-subtle text-primary rounded-3 p-3 d-inline-flex">
                      <i className="bi bi-mortarboard-fill fs-2"></i>
                    </div>
                    <span className="badge bg-primary text-white rounded-pill px-3 py-1 small">PORTAL 01</span>
                  </div>
                  <h4 className="fw-bold text-dark font-heading mb-2">Student Portal</h4>
                  <p className="text-secondary small mb-4">
                    Submit new outpass requests, inspect real-time approval stages, and generate digital QR gate passes for campus exit.
                  </p>
                </div>
                <div>
                  <Link to="/login/student" className="btn btn-primary-gradient w-100 btn-rounded py-3 justify-content-center shadow-sm mb-2">
                    <span>Student Login</span>
                    <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                  <Link to="/signup/student" className="btn btn-white border w-100 btn-rounded py-2 justify-content-center small text-secondary">
                    Create New Account
                  </Link>
                </div>
              </div>
            </div>

            {/* Teacher Card */}
            <div className="col-md-4">
              <div className="card border-0 rounded-4 shadow-sm h-100 p-4 bg-light border d-flex flex-column justify-content-between hover-lift">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="bg-success-subtle text-success rounded-3 p-3 d-inline-flex">
                      <i className="bi bi-person-badge-fill fs-2"></i>
                    </div>
                    <span className="badge bg-success text-white rounded-pill px-3 py-1 small">PORTAL 02</span>
                  </div>
                  <h4 className="fw-bold text-dark font-heading mb-2">Class Teacher Portal</h4>
                  <p className="text-secondary small mb-4">
                    Review assigned student outpass requests, verify reasons, provide advisor comments, and forward to HOD for sign-off.
                  </p>
                </div>
                <div>
                  <Link to="/login/teacher" className="btn btn-success w-100 btn-rounded py-3 justify-content-center shadow-sm mb-2">
                    <span>Teacher Login</span>
                    <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                  <Link to="/signup/teacher" className="btn btn-white border w-100 btn-rounded py-2 justify-content-center small text-secondary">
                    Register Teacher Account
                  </Link>
                </div>
              </div>
            </div>

            {/* HOD Card */}
            <div className="col-md-4">
              <div className="card border-0 rounded-4 shadow-sm h-100 p-4 bg-light border d-flex flex-column justify-content-between hover-lift">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="bg-dark text-white rounded-3 p-3 d-inline-flex">
                      <i className="bi bi-shield-lock-fill fs-2"></i>
                    </div>
                    <span className="badge bg-dark text-white rounded-pill px-3 py-1 small">PORTAL 03</span>
                  </div>
                  <h4 className="fw-bold text-dark font-heading mb-2">HOD Executive Portal</h4>
                  <p className="text-secondary small mb-4">
                    Perform final executive authorization for teacher-recommended applications with comprehensive department oversight.
                  </p>
                </div>
                <div>
                  <Link to="/login/hod" className="btn btn-dark w-100 btn-rounded py-3 justify-content-center shadow-sm mb-2">
                    <span>HOD Executive Login</span>
                    <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                  <Link to="/signup/hod" className="btn btn-white border w-100 btn-rounded py-2 justify-content-center small text-secondary">
                    Register HOD Account
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Institutional Light Footer ── */}
      <footer className="pro-footer-light bg-light text-dark pt-5 pb-4 border-top">
        <div className="container-fluid px-4 px-lg-5">
          <div className="row g-4 pb-4 border-bottom border-slate-200">
            
            <div className="col-lg-5">
              <div className="d-flex align-items-center gap-3 mb-3">
                <img src={COLLEGE_INFO.logo} alt="Apex Logo" className="bg-white p-1 rounded border" style={{ height: '48px' }} />
                <div>
                  <h5 className="fw-bold font-heading mb-0 text-dark">{COLLEGE_INFO.name}</h5>
                  <span className="text-primary small fw-medium">{COLLEGE_INFO.tagline}</span>
                </div>
              </div>
              <p className="text-secondary small pe-lg-4 mb-3">
                Apex Digital Outpass Management System is an automated workflow platform designed for high-assurance campus security, student movement governance, and paperless administrative records.
              </p>
              <div className="d-flex align-items-center gap-3 text-secondary small">
                <span><i className="bi bi-building text-primary me-1"></i> Institution Code: {COLLEGE_INFO.code}</span>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <h6 className="fw-bold font-heading text-dark text-uppercase mb-3" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>System Portals</h6>
              <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
                <li><Link to="/login/student" className="text-secondary text-decoration-none hover-primary"><i className="bi bi-chevron-right me-1"></i> Student Portal Sign In</Link></li>
                <li><Link to="/login/teacher" className="text-secondary text-decoration-none hover-primary"><i className="bi bi-chevron-right me-1"></i> Class Teacher Approvals</Link></li>
                <li><Link to="/login/hod" className="text-secondary text-decoration-none hover-primary"><i className="bi bi-chevron-right me-1"></i> HOD Executive Authorization</Link></li>
                <li><Link to="/signup/student" className="text-secondary text-decoration-none hover-primary"><i className="bi bi-chevron-right me-1"></i> Student Self Registration</Link></li>
              </ul>
            </div>

            <div className="col-sm-6 col-lg-4">
              <h6 className="fw-bold font-heading text-dark text-uppercase mb-3" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>Campus Contact Information</h6>
              <div className="text-secondary small d-flex flex-column gap-2">
                <div><i className="bi bi-geo-alt-fill text-primary me-2"></i> Kothandaraman Nagar, Muthanampatti (P.O), Dindigul - 624 622, Tamil Nadu, India.</div>
                <div><i className="bi bi-envelope-fill text-primary me-2"></i> support@apexoutpass.edu</div>
                <div><i className="bi bi-telephone-fill text-primary me-2"></i> +91 451 2554032 / 2554400</div>
              </div>
            </div>

          </div>

          <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between pt-4 text-secondary small">
            <div>
              © {new Date().getFullYear()} {COLLEGE_INFO.name}. All Rights Reserved.
            </div>
            <div className="mt-2 mt-sm-0">
              Digital Outpass Management System • Version 2.4 (Enterprise Edition)
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
