import React from 'react';
import './AdminDashboard.css';

// Standalone modal component that will stay visible
const AdminModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="admin-modal-overlay" onClick={handleModalClick}>
      <div className="admin-modal-content" onClick={handleModalClick}>
        <div className="admin-modal-header">
          <h2>{title}</h2>
          <button className="admin-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="admin-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
