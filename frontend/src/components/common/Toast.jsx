/**
 * Toast Component
 * Notification system with auto-dismiss and multiple variants
 */

import React, { useState, useEffect } from 'react';
import './Toast.css';

// Individual Toast Component
const Toast = ({
  id,
  message,
  type = 'info',              // success, error, warning, info
  duration = 4000,            // Auto-dismiss duration in ms
  action = null,              // Optional action button
  onClose,
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>

      {action && (
        <button className="toast-action" onClick={action.onClick}>
          {action.label}
        </button>
      )}

      <button className="toast-close" onClick={onClose} aria-label="Close">
        ✕
      </button>
    </div>
  );
};

// Toast Container Component (manages multiple toasts)
const ToastContainer = ({ position = 'top-right' }) => {
  const [toasts, setToasts] = useState([]);

  // Global toast manager function (exposed via window)
  useEffect(() => {
    window.showToast = (message, type = 'info', options = {}) => {
      const id = Date.now();
      const newToast = {
        id,
        message,
        type,
        duration: options.duration !== undefined ? options.duration : 4000,
        action: options.action,
      };

      setToasts(prev => [...prev, newToast]);

      // Auto-remove after duration
      if (options.duration !== false) {
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, newToast.duration + 300);
      }

      return id;
    };

    // Convenience functions
    window.toastSuccess = (message, options = {}) =>
      window.showToast(message, 'success', options);
    window.toastError = (message, options = {}) =>
      window.showToast(message, 'error', options);
    window.toastWarning = (message, options = {}) =>
      window.showToast(message, 'warning', options);
    window.toastInfo = (message, options = {}) =>
      window.showToast(message, 'info', options);

    return () => {
      delete window.showToast;
      delete window.toastSuccess;
      delete window.toastError;
      delete window.toastWarning;
      delete window.toastInfo;
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className={`toast-container toast-${position}`}>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export { Toast, ToastContainer };
export default ToastContainer;
