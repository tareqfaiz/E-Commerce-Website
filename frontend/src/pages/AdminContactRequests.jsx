import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import './AdminContactRequests.css';
import MessageModal from '../components/MessageModal';

const AdminContactRequests = () => {
  const [replyModal, setReplyModal] = useState({ show: false, contact: null });
  const [contacts, setContacts] = useState([]);

 const deleteContact = async (contactId) => {
    setSelectedContact(contactId);
    setMessageModal({
      show: true,
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this contact?',
      onConfirm: async () => {
        try {
          await axios.delete(`/contact/${contactId}`, { data: { confirm: true } });
          fetchContacts(page);
        } catch (error) {
          console.error('Failed to delete contact:', error);
          alert('Failed to delete contact');
        } finally {
          hideMessage();
        }
      },
      onCancel: () => {
        hideMessage();
      },
    });
  };
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [adminName, setAdminName] = useState('Admin'); // You can replace with actual admin name from auth context
  const [messageModal, setMessageModal] = useState({ show: false, title: '', contact: null, message: '', onConfirm: null, onCancel: null });

  const fetchContacts = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/contact?page=${pageNumber}`);
      setContacts(data.contacts);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch contact requests:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const markAsRead = async (contactId, read) => {
    try {
      await axios.patch(`/contact/${contactId}/read`, { read });
      fetchContacts(page);
    } catch (error) {
      console.error('Failed to update read status:', error);
    }
  };

  const sendReply = async () => {
    if (!replyMessage.trim() || !selectedContact) return;
    try {
      await axios.post(`/contact/${selectedContact._id}/reply`, {
        replyMessage,
        adminName,
      });
      alert('Reply sent successfully');
      setReplyMessage('');
      setSelectedContact(null);
      fetchContacts(page);
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply');
    }
  };

 const showMessage = async (contact) => {
    setMessageModal({ show: true, contact: contact });
    if (!contact.read) {
      try {
        await axios.patch(`/contact/${contact._id}/read`, { read: true });
        fetchContacts(page);
      } catch (error) {
        console.error('Failed to update read status:', error);
      }
    }
  };

  const hideMessage = () => {
    setMessageModal({ show: false, title: '', contact: null, message: '', onConfirm: null, onCancel: null });
    setSelectedContact(null); // Also clear selectedContact when closing message
  };

  return (
    <div className="admin-contact-requests">
      <h2>Contact Requests</h2>
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
                    className="message-cell"
                    onClick={() => showReply(contact)}
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    title="Click to view reply"
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
            <div className="message-modal">
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
        onConfirm={messageModal.onConfirm}
        onCancel={messageModal.onCancel}
      />
        </>
      )}
    </div>
  );

  function showReply(contact) {
    setReplyModal({ show: true, contact: contact });
  }

  function hideReply() {
    setReplyModal({ show: false, contact: null });
  }
};

export default AdminContactRequests;
