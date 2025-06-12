import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ show, title, message, onConfirm, onCancel }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="confirm-modal" onClick={(e) => {
      if (e.target.className === 'confirm-modal') {
        onCancel();
      }
    }}>
      <div className="confirm-modal-content">
        <span className="confirm-close" onClick={onCancel}>&times;</span>
        <h3 className="confirm-modal-title">{title}</h3>
        <div className="confirm-modal-message">
          <p>{message}</p>
        </div>
        <div className="confirm-modal-actions">
          <button className="confirm-button confirm" onClick={onConfirm}>Confirm</button>
          <button className="confirm-button cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
