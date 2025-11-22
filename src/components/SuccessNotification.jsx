import React, { useEffect } from 'react';

const SuccessNotification = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div style={overlayStyle}>
      <div style={notificationStyle}>
        <div style={headerStyle}>
          <div style={iconContainerStyle}>
            <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 style={titleStyle}>Success</h3>
          <button onClick={onClose} style={closeButtonStyle}>
            &times;
          </button>
        </div>
        <div style={messageStyle}>
          {message}
        </div>
        <div style={progressBarContainerStyle}>
          <div style={progressBarStyle(duration)} />
        </div>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  right: 0,
  left: 0,
  zIndex: 9999,
  display: 'flex',
  justifyContent: 'center',
  padding: '20px',
  pointerEvents: 'none',
};

const notificationStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 10px 40px rgba(22, 163, 74, 0.2)',
  maxWidth: '500px',
  width: '100%',
  overflow: 'hidden',
  pointerEvents: 'auto',
  animation: 'slideDown 0.3s ease-out',
  border: '2px solid #bbf7d0',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '16px 20px',
  backgroundColor: '#f0fdf4',
  borderBottom: '1px solid #bbf7d0',
};

const iconContainerStyle = {
  width: '24px',
  height: '24px',
  marginRight: '12px',
  color: '#16a34a',
};

const iconStyle = {
  width: '100%',
  height: '100%',
};

const titleStyle = {
  margin: 0,
  fontSize: '18px',
  fontWeight: '600',
  color: '#166534',
  flex: 1,
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '28px',
  cursor: 'pointer',
  color: '#166534',
  padding: '0',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  transition: 'background-color 0.2s',
};

const messageStyle = {
  padding: '20px',
  color: '#166534',
  fontSize: '15px',
  lineHeight: '1.5',
  backgroundColor: 'white',
};

const progressBarContainerStyle = {
  height: '4px',
  backgroundColor: '#dcfce7',
  overflow: 'hidden',
};

const progressBarStyle = (duration) => ({
  height: '100%',
  backgroundColor: '#16a34a',
  animation: `shrink ${duration}ms linear forwards`,
});

export default SuccessNotification;

// Add keyframe animations via style tag
if (typeof document !== 'undefined' && !document.getElementById('success-notification-styles')) {
  const style = document.createElement('style');
  style.id = 'success-notification-styles';
  style.textContent = `
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes shrink {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }
  `;
  document.head.appendChild(style);
}
