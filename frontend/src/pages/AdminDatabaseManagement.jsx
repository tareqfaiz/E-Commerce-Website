import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from '../components/AdminNavbar';
import AdminFooter from '../components/AdminFooter';
import './AdminDatabaseManagement.css';

function AdminDatabaseManagement() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchDatabases();
  }, [isAuthenticated, user, navigate]);

  const fetchDatabases = async () => {
    try {
      const response = await api.get('/databases');
      setDatabases(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch databases');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this database entry?')) return;
    try {
      await api.delete(`/databases/${id}`);
      setDatabases(databases.filter(db => db._id !== id));
    } catch (err) {
      setError('Failed to delete database entry');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/databases/edit/${id}`);
  };

  const handleAddNew = () => {
    navigate('/admin/databases/new');
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-database-management">
        <header className="admin-header">
          <h1>Database Management</h1>
          <button className="add-database-button" onClick={handleAddNew}>Add New Entry</button>
        </header>
        {loading ? (
          <p>Loading database entries...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="database-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {databases.map(db => (
                <tr key={db._id}>
                  <td>{db._id}</td>
                  <td>{db.name}</td>
                  <td>{db.details}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEdit(db._id)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(db._id)}>Delete</button>
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

export default AdminDatabaseManagement;
