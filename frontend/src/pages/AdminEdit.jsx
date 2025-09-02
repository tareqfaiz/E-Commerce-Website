import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from '../components/AdminNavbar';
import AdminFooter from '../components/AdminFooter';
import './AdminManagement.css'; // Import shared CSS for blurred-email

function AdminEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [admin, setAdmin] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await api.get(`/admin/admins/${id}`);
        setAdmin(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
        setRole(response.data.role);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch admin data');
        setLoading(false);
      }
    };

    if (user?.role === 'superadmin') {
      fetchAdmin();
    } else {
      navigate('/admin/admins');
    }
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/admins/${id}`, { name, email, role });
      navigate('/admin/admins');
    } catch (err) {
      setError('Failed to update admin');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <AdminNavbar />
      <div className="form-container">
        <h2>Edit Admin</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input ${user?.role !== 'superadmin' ? 'blurred-email' : ''}`}
              readOnly={user?.role !== 'superadmin'}
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="form-input">
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          <button type="submit" className="form-button">Save Changes</button>
        </form>
      </div>
      <AdminFooter />
    </>
  );
}

export default AdminEdit;