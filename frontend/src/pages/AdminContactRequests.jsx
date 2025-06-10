import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import './AdminContactRequests.css';

const AdminContactRequests = () => {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [adminName, setAdminName] = useState('Admin'); // You can replace with actual admin name from auth context

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact._id} className={contact.read ? 'read' : 'unread'}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.message}</td>
                  <td>{new Date(contact.createdAt).toLocaleString()}</td>
                  <td>{contact.read ? 'Yes' : 'No'}</td>
                  <td>{contact.readAt ? new Date(contact.readAt).toLocaleString() : '-'}</td>
                  <td>{contact.repliedBy || '-'}</td>
                  <td>{contact.repliedAt ? new Date(contact.repliedAt).toLocaleString() : '-'}</td>
                  <td>
                    {!contact.read && (
                      <button onClick={() => markAsRead(contact._id, true)}>Mark as Read</button>
                    )}
                    {contact.read && (
                      <button onClick={() => markAsRead(contact._id, false)}>Mark as Unread</button>
                    )}
                    <button onClick={() => setSelectedContact(contact)}>Reply</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => fetchContacts(page - 1)}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => fetchContacts(page + 1)}>Next</button>
          </div>
          {selectedContact && (
            <div className="reply-modal">
              <h3>Reply to {selectedContact.name}</h3>
              <textarea
                value={replyMessage}
                onChange={e => setReplyMessage(e.target.value)}
                placeholder="Type your reply here..."
              />
              <div className="modal-actions">
                <button onClick={sendReply}>Send Reply</button>
                <button onClick={() => setSelectedContact(null)}>Cancel</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminContactRequests;
