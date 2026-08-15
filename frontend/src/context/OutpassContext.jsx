import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../data/constants';

const OutpassContext = createContext(null);

export const OutpassProvider = ({ children }) => {
  // Current user state (persisted in localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('outpass_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Outpass requests list from the API
  const [requests, setRequests] = useState([]);

  // Loading & error states
  const [loading, setLoading] = useState(false);

  // Toast Notification state
  const [toast, setToast] = useState(null);

  // Sync currentUser to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('outpass_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('outpass_current_user');
    }
  }, [currentUser]);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // ===== Fetch outpass requests from the backend API =====
  const fetchRequests = useCallback(async () => {
    if (!currentUser) {
      setRequests([]);
      return;
    }

    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/outpasses?role=${currentUser.role}`;
      if (currentUser.role === 'student') {
        url += `&studentId=${currentUser.id}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setRequests(data.requests || []);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error('Failed to fetch outpass requests:', err);
      showToast('Failed to load outpass requests. Is the backend running?', 'danger');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Re-fetch requests when user changes (login/logout/role switch)
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // ===== Login handler — calls POST /api/auth/login =====
  const login = async (roleKey, credential, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credential,
          password: password,
          role: roleKey
        })
      });

      const data = await res.json();

      if (data.success && data.user) {
        setCurrentUser(data.user);
        showToast(`Logged in successfully as ${data.user.name} (${data.user.role.toUpperCase()})`, 'info');
        return data.user;
      } else {
        showToast(data.message || 'Login failed. Check your credentials.', 'danger');
        return null;
      }
    } catch (err) {
      console.error('Login error:', err);
      showToast('Cannot connect to server. Is the backend running?', 'danger');
      return null;
    }
  };

  // ===== Signup handler — calls POST /api/auth/signup =====
  const signup = async (formData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success && data.user) {
        setCurrentUser(data.user);
        showToast(`Welcome, ${data.user.name}! Account created successfully.`, 'success');
        return data.user;
      } else {
        showToast(data.message || 'Signup failed. Please try again.', 'danger');
        return null;
      }
    } catch (err) {
      console.error('Signup error:', err);
      showToast('Cannot connect to server. Is the backend running?', 'danger');
      return null;
    }
  };

  // ===== UpdateProfile handler — calls PUT /api/auth/profile/:id =====
  const updateProfile = async (formData) => {
    if (!currentUser?.id) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/profile/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        showToast('Profile updated successfully!', 'success');
        return data.user;
      } else {
        showToast(data.message || 'Failed to update profile.', 'danger');
        return null;
      }
    } catch (err) {
      console.error('Update profile error:', err);
      showToast('Cannot connect to server. Is the backend running?', 'danger');
      return null;
    }
  };

  // ===== Logout handler =====
  const logout = () => {
    setCurrentUser(null);
    setRequests([]);
    localStorage.removeItem('outpass_current_user');
    showToast('Logged out of Smart Outpass System', 'secondary');
  };

  // ===== Submit new outpass request — calls POST /api/outpasses =====
  const addRequest = async (formData) => {
    try {
      const payload = {
        studentId: currentUser?.id || '',
        studentName: formData.studentName || currentUser?.name || '',
        regNo: formData.regNo || currentUser?.regNo || '',
        department: formData.department || currentUser?.department || '',
        year: formData.year || currentUser?.year || '',
        teacherName: formData.teacherName || currentUser?.teacherName || '',
        reason: formData.reason,
        date: formData.date,
        outTime: formData.outTime,
        expectedReturnTime: formData.expectedReturnTime
      };

      const res = await fetch(`${API_BASE_URL}/api/outpasses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        showToast('Your outpass request has been sent to your Class Teacher.', 'success');
        await fetchRequests(); // Refresh list from backend
      } else {
        showToast(data.message || 'Failed to submit outpass request.', 'danger');
      }
    } catch (err) {
      console.error('Failed to submit outpass:', err);
      showToast('Failed to submit request. Is the backend running?', 'danger');
    }
  };

  // ===== Teacher Approve — calls PUT /api/outpasses/{id}/teacher-action =====
  const approveByTeacher = async (requestId, comments = '') => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/outpasses/${requestId}/teacher-action`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'Approved', comments })
      });

      const data = await res.json();

      if (data.success) {
        showToast('Request forwarded to HOD.', 'success');
        await fetchRequests();
      } else {
        showToast(data.message || 'Failed to approve request.', 'danger');
      }
    } catch (err) {
      console.error('Teacher approve error:', err);
      showToast('Failed to approve. Is the backend running?', 'danger');
    }
  };

  // ===== Teacher Reject =====
  const rejectByTeacher = async (requestId, comments = '') => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/outpasses/${requestId}/teacher-action`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'Rejected', comments })
      });

      const data = await res.json();

      if (data.success) {
        showToast('Outpass request rejected by Class Teacher.', 'danger');
        await fetchRequests();
      } else {
        showToast(data.message || 'Failed to reject request.', 'danger');
      }
    } catch (err) {
      console.error('Teacher reject error:', err);
      showToast('Failed to reject. Is the backend running?', 'danger');
    }
  };

  // ===== HOD Approve — calls PUT /api/outpasses/{id}/hod-action =====
  const approveByHod = async (requestId, comments = '') => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/outpasses/${requestId}/hod-action`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'Approved', comments })
      });

      const data = await res.json();

      if (data.success) {
        showToast('Outpass Approved Successfully.', 'success');
        await fetchRequests();
      } else {
        showToast(data.message || 'Failed to approve request.', 'danger');
      }
    } catch (err) {
      console.error('HOD approve error:', err);
      showToast('Failed to approve. Is the backend running?', 'danger');
    }
  };

  // ===== HOD Reject =====
  const rejectByHod = async (requestId, comments = '') => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/outpasses/${requestId}/hod-action`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'Rejected', comments })
      });

      const data = await res.json();

      if (data.success) {
        showToast('Outpass request rejected by HOD.', 'danger');
        await fetchRequests();
      } else {
        showToast(data.message || 'Failed to reject request.', 'danger');
      }
    } catch (err) {
      console.error('HOD reject error:', err);
      showToast('Failed to reject. Is the backend running?', 'danger');
    }
  };

  return (
    <OutpassContext.Provider
      value={{
        currentUser,
        requests,
        loading,
        toast,
        login,
        signup,
        logout,
        updateProfile,
        addRequest,
        approveByTeacher,
        rejectByTeacher,
        approveByHod,
        rejectByHod,
        fetchRequests,
        showToast
      }}
    >
      {children}
    </OutpassContext.Provider>
  );
};

export const useOutpass = () => {
  const context = useContext(OutpassContext);
  if (!context) {
    throw new Error('useOutpass must be used within an OutpassProvider');
  }
  return context;
};
