import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from '../components/AdminNavbar';
import AdminFooter from '../components/AdminFooter';
import './AdminManagement.css';

function AdminManagement() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Remove console.log after debugging
    // console.log('User from useAuth in AdminManagement:', user);
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchAdmins();
  }, [isAuthenticated, user, navigate]);

  const fetchAdmins = async () => {
    try {
      const response = await api.get('/admin/admins');
      setAdmins(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch admins');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    try {
      await api.delete(`/admin/admins/${id}`);
      setAdmins(admins.filter(admin => admin._id !== id));
    } catch (err) {
      setError('Failed to delete admin');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/admins/edit/${id}`);
  };

  const handleAddNew = () => {
    navigate('/admin/register');
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-management">
        <header className="admin-header">
          <h1>Admin Management</h1>
          {user?.role === 'superadmin' && (
            <button className="add-admin-button" onClick={handleAddNew}>Add New Admin</button>
          )}
        </header>
        {loading ? (
          <p>Loading admins...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin._id}>
                  <td>{admin.name}</td>
                  <td className={user?.role !== 'superadmin' ? 'blurred-email' : ''}>{admin.email}</td>
                  <td>{admin.role}</td>
                  <td>
                    {user?.role === 'superadmin' && (
                      <>
                        <button className="edit-button" onClick={() => handleEdit(admin._id)}>Edit</button>
                        <button className="delete-button" onClick={() => handleDelete(admin._id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <AdminFooter />
    </>
  );
}

export default AdminManagement;