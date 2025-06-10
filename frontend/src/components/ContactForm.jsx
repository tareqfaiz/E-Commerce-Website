import React, { useState } from 'react';
import API from '../api/api';

const ContactForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const response = await API.post('/contact', formData);
      setStatus({ success: true, message: response.data.message });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({ success: false, message: error.response?.data?.message || 'Submission failed' });
    }
  };

  return (
    <div className="contact-form-popup" style={{
      position: 'fixed',
      top: '20%',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'white',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      zIndex: 1000,
      width: '300px',
      borderRadius: '8px',
    }}>
      <button onClick={onClose} style={{ float: 'right', cursor: 'pointer' }}>X</button>
      <h3>Contact Us</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label><br />
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Message:</label><br />
          <textarea name="message" value={formData.message} onChange={handleChange} required />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Send</button>
      </form>
      {status && (
        <p style={{ color: status.success ? 'green' : 'red' }}>{status.message}</p>
      )}
    </div>
  );
};

export default ContactForm;
