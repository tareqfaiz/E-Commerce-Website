import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { usePage } from '../context/PageContext';

const logoUrl = 'https://cdn-icons-png.flaticon.com/512/263/263142.png';

function Navbar() {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
  };

  const { currentPage, setCurrentPage } = usePage();

  const handleLogoClick = () => {
    setCurrentPage(1);
    navigate('/products?page=1');
  };

  return (
    <nav className="navbar navbar-bordered">
      <div className="navbar-container">
        <div
          onClick={handleLogoClick}
          className="navbar-brand"
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
          }}
        >
          <img 
            src={logoUrl} 
            alt="Afrin's Logo" 
            className="navbar-logo"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.3s ease',
            }}
          />
          <span 
            className="navbar-shop-name"
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'white',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              letterSpacing: '1px',
            }}
          >
            Afrin's
          </span>
        </div>

        <form onSubmit={handleSearch} className="navbar-search" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="navbar-search-input"
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid #ccc',
              outline: 'none',
              width: '180px',
              transition: 'box-shadow 0.3s ease',
            }}
            onFocus={e => e.target.style.boxShadow = '0 0 8px #3b82f6'}
            onBlur={e => e.target.style.boxShadow = 'none'}
          />
          <button
            type="submit"
            className="navbar-search-button"
            style={{
              backgroundColor: '#3b82f6',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              color: 'white',
              fontSize: '18px',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            <span role="img" aria-label="search">🔍</span>
          </button>
        </form>

        <div className="navbar-links" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link
            to="/"
            className="navbar-link"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e40af'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            Home
          </Link>
          <Link
            to={`/products?page=${currentPage}`}
            className="navbar-link"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#7c3aed',
              color: 'white',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6d28d9'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#7c3aed'}
          >
            Products
          </Link>
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setIsCartPreviewOpen(true)}
            onMouseLeave={() => setIsCartPreviewOpen(false)}
          >
            <Link
              to="/cart"
              className="navbar-link"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: '#10b981',
                color: 'white',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              🛒 Cart <span className="cart-count" style={{ fontWeight: 'bold' }}>{totalItems}</span>
            </Link>
            {isCartPreviewOpen && cartItems.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                width: '300px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                zIndex: 50,
                padding: '12px',
              }}>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {cartItems.map(item => (
                    <div key={`${item.id}-${item.size}`} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      <img 
                        src={item.image} 
                        alt={item.title}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#1f2937'
                        }}>{item.title}</div>
                        <div style={{ 
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>Size: {item.size} | Qty: {item.quantity}</div>
                      </div>
                      <div style={{ 
                        fontWeight: '600',
                        color: '#059669'
                      }}>${item.price}</div>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  borderTop: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontWeight: '600' }}>
                    Total: ${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                  </div>
                  <Link
                    to="/cart"
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link
            to="/login"
            className="navbar-link"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e40af'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="navbar-link"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e40af'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            Register
          </Link>
        </div>
        <div className="navbar-menu-button">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <span className="close-icon">&#x2715;</span>
            ) : (
              <span className="hamburger-icon">&#9776;</span>
            )}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="navbar-mobile-menu">
          <form onSubmit={handleSearch} className="navbar-mobile-search">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar-search-input"
            />
            <button type="submit" className="navbar-search-button">
              <span role="img" aria-label="search">🔍</span>
            </button>
          </form>
          <Link
            to="/"
            className="navbar-mobile-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products?page=1"
            className="navbar-mobile-link"
            onClick={() => {
              setIsMenuOpen(false);
              setCurrentPage(1);
              navigate('/products?page=1');
            }}
          >
            Products
          </Link>
          <Link
            to="/cart"
            className="navbar-mobile-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Cart <span className="cart-count">({totalItems})</span>
          </Link>
          <Link
            to="/login"
            className="navbar-mobile-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="navbar-mobile-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
