import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from '../components/AdminNavbar';
import AdminFooter from '../components/AdminFooter';
import './AdminProductManagement.css';

function AdminProductManagement() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchProducts();
  }, [isAuthenticated, user, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(product => product._id !== id));
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleAddNew = () => {
    navigate('/admin/products/new');
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-product-management">
        <header className="admin-header">
          <h1>Product Management</h1>
          <button className="add-product-button" onClick={handleAddNew}>Add New Product</button>
        </header>
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Category</th>
                <th>Sizes & Quantities</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const sizes = product.sizes || [];
                const sizesDisplay = sizes.map(s => `${s.size}: ${s.quantity}`).join(', ');
                return (
                  <tr key={product._id}>
                    <td>{product.title}</td>
                    <td>${product.price}</td>
                    <td>{product.category}</td>
                    <td>{sizesDisplay}</td>
                    <td>
                      <button className="edit-button" onClick={() => handleEdit(product._id)}>Edit</button>
                      <button className="delete-button" onClick={() => handleDelete(product._id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <AdminFooter />
    </>
  );
}

export default AdminProductManagement;
