import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from '../components/AdminNavbar';
import AdminFooter from '../components/AdminFooter';
import './AdminProductForm.css';

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'Universal'];

function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.token || localStorage.getItem('token');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [sizes, setSizes] = useState([]);
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
        setSizes(data.sizes || []);
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

  const handleSizeToggle = (size) => {
    const existingIndex = sizes.findIndex(s => s.size === size);
    if (existingIndex >= 0) {
      // Remove size
      const newSizes = sizes.filter(s => s.size !== size);
      setSizes(newSizes);
    } else {
      // Add size with default quantity '00'
      setSizes([...sizes, { size, quantity: '00' }]);
    }
  };

  const handleQuantityChange = (size, value) => {
    // Format quantity as two digits
    let formattedValue = value.toString().padStart(2, '0');
    if (!/^\d{0,2}$/.test(formattedValue)) {
      return; // Ignore invalid input
    }
    const newSizes = sizes.map(s => {
      if (s.size === size) {
        return { ...s, quantity: formattedValue };
      }
      return s;
    });
    setSizes(newSizes);
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
      if (sizes.length === 0) {
        setMessage('Please select at least one size.');
        setUploading(false);
        return;
      }
      // Prepare sizes with quantity as number
      const preparedSizes = sizes.map(s => ({
        size: s.size,
        quantity: parseInt(s.quantity, 10),
      }));

      const productData = {
        title,
        description,
        price: parseFloat(price),
        category,
        sizes: preparedSizes,
        image: updatedImageUrl,
      };

      await API.put(`/products/${id}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
          </div>
          <div>
            <label>Sizes and Quantities:</label>
            <div className="size-options">
              {SIZE_OPTIONS.map(size => {
                const selectedSize = sizes.find(s => s.size === size);
                return (
                  <div key={size} className="size-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={!!selectedSize}
                        onChange={() => handleSizeToggle(size)}
                      />
                      {size}
                    </label>
                    {selectedSize && (
                      <input
                        type="text"
                        maxLength="2"
                        pattern="\d{2}"
                        value={selectedSize.quantity}
                        onChange={e => handleQuantityChange(size, e.target.value)}
                        required
                      />
                    )}
                  </div>
                );
              })}
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
