import React from 'react';
import './MessageModal.css';

const MessageModal = ({ show, title, message, onConfirm, onCancel }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="message-modal">
      <div className="message-modal-content">
        <h3 className="message-modal-title">{title}</h3>
        <p className="message-modal-message">{message}</p>
        <div className="message-modal-actions">
          {onConfirm && (
            <button className="message-modal-button confirm" onClick={onConfirm}>
              Confirm
            </button>
          )}
          {onCancel && (
            <button className="message-modal-button cancel" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
