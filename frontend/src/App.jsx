import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { OutpassProvider, useOutpass } from './context/OutpassContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ToastNotification from './components/ToastNotification';
import OutpassFormModal from './components/OutpassFormModal';

import LandingPage from './pages/LandingPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import StudentLoginPage from './pages/StudentLoginPage';
import TeacherLoginPage from './pages/TeacherLoginPage';
import HodLoginPage from './pages/HodLoginPage';
import SignupPage from './pages/SignupPage';

import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import HodDashboard from './pages/HodDashboard';

// ── Public layout (no navbar/sidebar) ────────────────────────────────────────
const PublicLayout = () => (
  <Routes>
    <Route path="/"               element={<LandingPage />} />
    <Route path="/login"          element={<RoleSelectionPage />} />
    <Route path="/login/student"  element={<StudentLoginPage />} />
    <Route path="/login/teacher"  element={<TeacherLoginPage />} />
    <Route path="/login/hod"      element={<HodLoginPage />} />
    <Route path="/signup/:role"   element={<SignupPage />} />
    {/* Any unknown path → back to home */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

// ── Authenticated app layout (navbar + sidebar) ───────────────────────────────
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      <div className="app-container flex-grow-1">
        <Sidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
          openOutpassModal={() => setIsApplyModalOpen(true)}
        />
        <main className="main-content">{children}</main>
      </div>

      <ToastNotification />

      <OutpassFormModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
};

// ── Protected route wrapper ───────────────────────────────────────────────────
const ProtectedRoute = ({ allowedRole, children }) => {
  const { currentUser } = useOutpass();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== allowedRole) {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }
  return children;
};

// ── Root: decides whether to show public or authenticated layout ──────────────
const Root = () => {
  const { currentUser } = useOutpass();
  const location = useLocation();

  // Public pages — always accessible even when logged in
  const publicPaths = ['/', '/login', '/login/student', '/login/teacher', '/login/hod'];
  const isPublicPath =
    publicPaths.includes(location.pathname) ||
    location.pathname.startsWith('/signup');

  // If logged in and trying to access a public path, redirect to dashboard
  if (currentUser && isPublicPath) {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  // Not logged in → public layout
  if (!currentUser) {
    return <PublicLayout />;
  }

  // Logged in → app layout with protected routes
  return (
    <AppLayout>
      <Routes>
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hod"
          element={
            <ProtectedRoute allowedRole="hod">
              <HodDashboard />
            </ProtectedRoute>
          }
        />
        {/* Anything else → redirect to role dashboard */}
        <Route path="*" element={<Navigate to={`/${currentUser.role}`} replace />} />
      </Routes>
    </AppLayout>
  );
};

// ── App entry ─────────────────────────────────────────────────────────────────
function App() {
  return (
    <OutpassProvider>
      <Router>
        <Root />
      </Router>
    </OutpassProvider>
  );
}

export default App;
