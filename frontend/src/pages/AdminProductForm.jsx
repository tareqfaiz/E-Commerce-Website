import React, { useState } from 'react';
import API from '../services/api';

function AdminProductForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setMessage('Please select an image file.');
      return;
    }
    setUploading(true);
    try {
      // Upload image first
      const formData = new FormData();
      formData.append('image', imageFile);
      const uploadRes = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = uploadRes.data.imageUrl;

      // Create product with image URL
      const productData = {
        title,
        description,
        price: parseFloat(price),
        category,
        stock: parseInt(stock),
        image: imageUrl,
      };
      await API.post('/products', productData);
      setMessage('Product added successfully!');
      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
      setStock('');
      setImageFile(null);
    } catch (error) {
      setMessage('Error adding product: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-product-form">
      <h2>Add New Product</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
        <div>
          <label>Category:</label>
          <input value={category} onChange={e => setCategory(e.target.value)} required />
        </div>
        <div>
          <label>Stock:</label>
          <input type="number" value={stock} onChange={e => setStock(e.target.value)} required />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} required />
        </div>
        <button type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Add Product'}</button>
      </form>
    </div>
  );
}

export default AdminProductForm;
