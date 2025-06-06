import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';
import AdminNavbar from '../components/AdminNavbar';
import AdminFooter from '../components/AdminFooter';
import './AdminProductForm.css';

function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
        setCategory(data.category);
        setStock(data.stock);
        setImageUrl(data.image);
      } catch (error) {
        setMessage('Error fetching product data');
      }
    };
    fetchProduct();
  }, [id]);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let updatedImageUrl = imageUrl;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await API.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        updatedImageUrl = uploadRes.data.imageUrl;
      }

      const productData = {
        title,
        description,
        price: parseFloat(price),
        category,
        stock: parseInt(stock),
        image: updatedImageUrl,
      };

      await API.put(`/products/${id}`, productData);
      setMessage('Product updated successfully!');
      navigate('/admin/products');
    } catch (error) {
      setMessage('Error updating product: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-product-form">
        <h2>Edit Product</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title:</label>
              <input name="title" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="form-group small">
              <label>Price:</label>
              <input name="price" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
          </div>
          <div>
            <label>Description:</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category:</label>
              <input name="category" value={category} onChange={e => setCategory(e.target.value)} required />
            </div>
            <div className="form-group small">
              <label>Stock:</label>
              <input name="stock" type="number" value={stock} onChange={e => setStock(e.target.value)} required />
            </div>
          </div>
          <div>
            <label>Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imageUrl && !imageFile && (
              <div style={{ marginTop: '8px' }}>
                <img src={imageUrl} alt="Current" style={{ maxWidth: '200px' }} />
              </div>
            )}
          </div>
          <button type="submit" disabled={uploading}>{uploading ? 'Updating...' : 'Update Product'}</button>
        </form>
      </div>
      <AdminFooter />
    </>
  );
}

export default AdminProductEdit;
