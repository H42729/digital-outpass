import React from 'react';
import { useOutpass } from '../context/OutpassContext';

const ToastNotification = () => {
  const { toast } = useOutpass();

  if (!toast) return null;

  const bgClass = 
    toast.type === 'success' ? 'bg-success text-white' :
    toast.type === 'danger' ? 'bg-danger text-white' :
    toast.type === 'info' ? 'bg-primary text-white' : 'bg-dark text-white';

  const iconClass = 
    toast.type === 'success' ? 'bi-check-circle-fill' :
    toast.type === 'danger' ? 'bi-exclamation-octagon-fill' :
    toast.type === 'info' ? 'bi-info-circle-fill' : 'bi-bell-fill';

  return (
    <div 
      className="toast-container position-fixed bottom-0 end-0 p-3" 
      style={{ zIndex: 1100 }}
    >
      <div className={`toast show align-items-center ${bgClass} border-0 rounded-4 shadow-lg`} role="alert">
        <div className="d-flex p-3">
          <div className="toast-body d-flex align-items-center gap-2 font-body fw-medium fs-6">
            <i className={`bi ${iconClass} fs-4`}></i>
            <div>{toast.message}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;
