import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { usePage } from '../context/PageContext';
import Pagination from '../components/Pagination';
import { useLocation } from 'react-router-dom';

const PRODUCTS_PER_PAGE = 6;

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { currentPage, setCurrentPage } = usePage();
  const { addToCart } = useCart();
  const location = useLocation();

  // State to track which product buttons are clicked
  const [clickedButtons, setClickedButtons] = useState({});

  // State to track selected size for each product
  const [selectedSizes, setSelectedSizes] = useState({});

  // State for loading
  const [isLoading, setIsLoading] = useState(false);
  
  // Extract search query and page from URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search')?.toLowerCase() || '';
  const pageFromUrl = parseInt(queryParams.get('page')) || 1;

  // Set page from URL parameter
  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    API.get('/products/categories').then(res => {
      setCategories(['all', ...res.data]);
    });
  }, []);

  useEffect(() => {
    let url = '/products';
    if (selectedCategory !== 'all') {
      url = `/products/category/${selectedCategory}`;
    }
    API.get(url).then(res => setProducts(res.data));
    setCurrentPage(1);
    // Update URL when category changes
    window.history.replaceState({}, '', '/products?page=1');
  }, [selectedCategory]);

  // Update URL and state when page changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(params.get('page')) || 1;
    
    if (pageFromUrl !== currentPage) {
      params.set('page', currentPage);
      window.history.replaceState({}, '', `/products?${params.toString()}`);
    }
  }, [currentPage, location.search]);

  // Filter products by search query
  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchQuery) ||
    p.description.toLowerCase().includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Handle add to cart with visual feedback
  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product._id];
    if (!selectedSize) {
      alert('Please select a size before adding to cart.');
      return;
    }
    // Find the size object from product.sizes
    const sizeObj = product.sizes.find(s => s.size === selectedSize);
    if (!sizeObj || sizeObj.quantity === 0) {
      alert('Selected size is out of stock.');
      return;
    }
    addToCart(product, selectedSize);
    setClickedButtons(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setClickedButtons(prev => ({ ...prev, [product._id]: false }));
    }, 1000); // 1 second feedback
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  return (
    <div className="container">
      <h1 className="page-title">
        {searchQuery ? `Search Results for "${searchQuery}"` : 'Products'}
      </h1>
      <div className="category-filter">
        <label className="category-label">Category:</label>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="product-grid">
        {filteredProducts.length === 0 && searchQuery && (
          <div className="no-results">
            No products found matching "{searchQuery}"
          </div>
        )}
        {paginatedProducts.map(p => {
          const sizes = p.sizes || [];
          const availableSizes = sizes.filter(s => s.quantity > 0);
          const isOutOfStock = availableSizes.length === 0;
          return (
            <div key={p._id} className="product-card">
              <img
                src={p.image && (p.image.startsWith('http') ? p.image : `${window.location.origin}${p.image}`)}
                alt={p.title}
                className="product-image"
              />
              <h2 className="product-title">{p.title}</h2>
              <p className="product-description">{p.description}</p>
              <p className="product-price">${p.price}</p>
              <div className="size-selector">
                <label htmlFor={`size-select-${p._id}`}>Size:</label>
                <select
                  id={`size-select-${p._id}`}
                  value={selectedSizes[p._id] || ''}
                  onChange={e => handleSizeChange(p._id, e.target.value)}
                  disabled={isOutOfStock}
                >
                  <option value="" disabled>{isOutOfStock ? 'Out of Stock' : 'Select size'}</option>
                  {sizes.map(size => (
                    <option
                      key={size.size}
                      value={size.size}
                      disabled={size.quantity === 0}
                    >
                      {size.size} {size.quantity === 0 ? '(Out of Stock)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => handleAddToCart(p)}
                className={`add-to-cart-button ${clickedButtons[p._id] ? 'clicked' : ''}`}
                disabled={isOutOfStock}
              >
                {clickedButtons[p._id] ? 'Added!' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          );
        })}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Products;
