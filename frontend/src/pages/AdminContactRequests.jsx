import React, { useEffect, useState } from 'react';
import api from '../api/api';
import './AdminContactRequests.css';
import MessageModal from '../components/MessageModal';
import ConfirmModal from '../components/ConfirmModal';

const AdminContactRequests = () => {
  const [replyModal, setReplyModal] = useState({ show: false, contact: null });
  const [contacts, setContacts] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [adminName, setAdminName] = useState('Admin'); // You can replace with actual admin name from auth context
  const [selectedContactForReply, setSelectedContactForReply] = useState(null);
  const [messageModal, setMessageModal] = useState({ show: false, title: '', contact: null, message: '' });
  const [isReplying, setIsReplying] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, contactId: null });

  const fetchContacts = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/contact?page=${pageNumber}`);
      setContacts(data.contacts);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch contact requests:', error);
      alert('Failed to fetch contact requests');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const markAsRead = async (contactId, read) => {
    try {
      await api.patch(`/contact/${contactId}/read`, { read });
      fetchContacts(page);
    } catch (error) {
      console.error('Failed to update read status:', error);
      alert('Failed to update read status');
    }
  };

  const sendReply = async (contactId) => {
    console.log('sendReply called with contactId:', contactId, 'replyMessage:', replyMessage);
    if (!replyMessage.trim() || !contactId) {
      console.log('replyMessage is empty or contactId is missing');
      return;
    }
    try {
      await api.post(`/contact/${contactId}/reply`, {
        replyMessage,
        adminName,
      });
      setNotification({ show: true, message: 'Reply sent successfully' });
      setTimeout(() => {
        setNotification({ show: false, message: '' });
      }, 3000);
      setReplyMessage('');
      setSelectedContact(null);
      fetchContacts(page);
      hideMessage();
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply');
    }
  };

  const showMessage = async (contact) => {
    setMessageModal({
      show: true,
      title: 'Message',
      message: contact.message,
      contact: contact,
      replyMessage: replyMessage,
      setReplyMessage: setReplyMessage,
    });
    setIsReplying(false);
    if (!contact.read) {
      try {
        await api.patch(`/contact/${contact._id}/read`, { read: true });
        fetchContacts(page);
      } catch (error) {
        console.error('Failed to update read status:', error);
        alert('Failed to update read status');
      }
    }
  };

  const hideMessage = () => {
    setMessageModal({ show: false, title: '', contact: null, message: '' });
    setSelectedContact(null); // Also clear selectedContact when closing message
  };

  const showReplySection = (contact) => {
    setSelectedContactForReply(contact);
    setMessageModal({
      show: true,
      title: `Reply to ${contact.name}`,
      message: (
        <div className="reply-section">
          <textarea
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Type your reply here..."
          />
          <div className="modal-actions">
            <button onClick={sendReply}>Send Reply</button>
            <button onClick={() => {
              setSelectedContactForReply(null);
              hideMessage();
            }}>Cancel</button>
          </div>
        </div>
      ),
      onCancel: () => {
        setSelectedContactForReply(null);
        hideMessage();
      },
    });
  };

  const deleteContact = (contactId) => {
    setDeleteModal({ show: true, contactId });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/contact/${deleteModal.contactId}`, { data: { confirm: true } });
      fetchContacts(page);
    } catch (error) {
      console.error('Failed to delete contact:', error);
      alert('Failed to delete contact');
    } finally {
      setDeleteModal({ show: false, contactId: null });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, contactId: null });
  };

  const hideReply = () => {
    setReplyModal({ show: false, contact: null });
  };

  return (
    <div className="admin-contact-requests">
      <h2>Contact Requests</h2>
      {notification.show && (
        <div className="notification">
          {notification.message}
        </div>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="contact-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Received At</th>
                <th>Read</th>
                <th>Read At</th>
                <th>Replied By</th>
                <th>Replied At</th>
                <th>Reply Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact._id} className={contact.read ? 'read' : 'unread'}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td
                    className="message-cell"
                    onClick={() => showMessage(contact)}
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    title="Click to view message"
                  >
                    {contact.message.substring(0, 50) + '...'}
                  </td>
                  <td>{new Date(contact.createdAt).toLocaleString()}</td>
                  <td>{contact.read ? 'Yes' : 'No'}</td>
                  <td>{contact.readAt ? new Date(contact.readAt).toLocaleString() : '-'}</td>
                  <td>{contact.repliedBy || '-'}</td>
                  <td>{contact.repliedAt ? new Date(contact.repliedAt).toLocaleString() : '-'}</td>
                  <td
                    className="reply-message-cell"
                    onClick={() => {
                      if (contact.replyMessage) {
                        setReplyModal({ show: true, contact });
                      }
                    }}
                  >
                    {contact.replyMessage ? contact.replyMessage.substring(0, 50) + '...' : '-'}
                  </td>
                  <td>
                    {!contact.read && (
                      <button onClick={() => markAsRead(contact._id, true)}>Read</button>
                    )}
                    {contact.read && (
                      <button onClick={() => markAsRead(contact._id, false)}>Unread</button>
                    )}
                    <button onClick={() => deleteContact(contact?._id)}>
                      <span role="img" aria-label="delete">
                        🗑️
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {replyModal.show && replyModal.contact && (
            <div className="message-modal" onClick={(e) => {
              if (e.target.className === 'message-modal') {
                hideReply();
              }
            }}>
              <div className="message-modal-content">
                <span className="message-close" onClick={hideReply}>&times;</span>
                <h3>Reply from {replyModal.contact.repliedBy}</h3>
                <p>{replyModal.contact.replyMessage}</p>
              </div>
            </div>
          )}
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => fetchContacts(page - 1)}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => fetchContacts(page + 1)}>Next</button>
          </div>
          <MessageModal
            show={messageModal.show}
            title={messageModal.title}
            message={messageModal.message}
            replyMessage={replyMessage}
            setReplyMessage={setReplyMessage}
            onCancel={hideMessage}
            onReply={() => {
              sendReply(messageModal.contact._id);
            }}
            isReplying={isReplying}
            onReplyClick={() => setIsReplying(true)}
            contactId={messageModal.contact?._id}
          />
          <ConfirmModal
            show={deleteModal.show}
            title="Confirm Delete"
            message="Are you sure you want to delete this contact request? This action cannot be undone."
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </>
      )}
    </div>
  );
};

export default AdminContactRequests;
