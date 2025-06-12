import React from 'react';
import './MessageModal.css';

const MessageModal = ({
  show,
  title,
  message,
  onCancel,
  replyMessage,
  setReplyMessage,
  onReply,
  isReplying,
  onReplyClick,
  contactId,
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="message-modal" onClick={(e) => {
      if (e.target.className === 'message-modal') {
        onCancel();
      }
    }}>
      <div className="message-modal-content">
        <span className="message-close" onClick={onCancel}>&times;</span>
        <h3 className="message-modal-title">{title}</h3>
        <div className="message-modal-message">
          <p>{message}</p>
        </div>
        {!isReplying ? (
          <button className="message-modal-button reply" onClick={onReplyClick}>
            Reply
          </button>
        ) : (
          <div className="reply-section">
            <textarea
              placeholder="Type your reply here..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
            <div className="modal-actions">
              <button className="message-modal-button confirm" onClick={() => {
                console.log('onReply clicked');
                onReply(contactId);
              }}>
                Send Reply
              </button>
            </div>
          
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageModal;
