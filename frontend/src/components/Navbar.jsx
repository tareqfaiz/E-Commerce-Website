import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { usePage } from '../context/PageContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const logoUrl = 'https://cdn-icons-png.flaticon.com/512/263/263142.png';

function Navbar() {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 480);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 480);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
  };

  const { currentPage, setCurrentPage } = usePage();

  const handleLogoClick = () => {
    setCurrentPage(1);
    if (isSmallScreen) {
      navigate('/');
    } else {
      navigate('/products?page=1');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className="navbar navbar-bordered"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: '#3b82f6',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div className="navbar-container" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
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

        {!isSmallScreen && (
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
                width: window.innerWidth <= 480 ? '32px' : '36px',
                height: window.innerWidth <= 480 ? '32px' : '36px',
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
        )}

        <div className="navbar-links" style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/"
            className="navbar-link navbar-link-home"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'background-color 0.3s ease',
              fontSize: '14px',
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
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: '#7c3aed',
              color: 'white',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'background-color 0.3s ease',
              fontSize: '14px',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6d28d9'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#7c3aed'}
          >
            Products
          </Link>
          {!user ? (
            <>
              <Link
                to="/login"
                className="navbar-link"
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'background-color 0.3s ease',
                  fontSize: '14px',
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
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'background-color 0.3s ease',
                  fontSize: '14px',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e40af'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="navbar-link"
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'background-color 0.3s ease',
                  fontSize: '14px',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e40af'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                Profile
              </Link>
              <Link
                to="/order-history"
                className="navbar-link"
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'background-color 0.3s ease',
                  fontSize: '14px',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e40af'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                Order History
              </Link>
              <button
                onClick={handleLogout}
                className="navbar-link"
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                Logout
              </button>
            </>
          )}
        </div>
        <Link
          to="/cart"
          className="navbar-link navbar-link-cart"
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: '#10b981',
            color: 'white',
            fontWeight: '600',
            textDecoration: 'none',
            display: 'flex !important',
            alignItems: 'center',
            gap: '4px',
            transition: 'background-color 0.3s ease',
            fontSize: '14px',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#059669'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#10b981'}
        >
          🛒 {isSmallScreen ? <><span className="cart-count" style={{ fontWeight: 'bold' }}>{totalItems}</span></> : <>Cart <span className="cart-count" style={{ fontWeight: 'bold' }}>{totalItems}</span></>}
        </Link>
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
        <div className="navbar-mobile-menu" style={{ position: 'absolute', top: '64px', left: 0, right: 0, backgroundColor: '#3b82f6', zIndex: 1001, display: 'flex', flexDirection: 'column', padding: '8px 16px' }}>
          <form onSubmit={handleSearch} className="navbar-mobile-search" style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar-search-input"
              style={{ flexGrow: 1, padding: '6px 12px', borderRadius: '20px', border: '1px solid #ccc', outline: 'none' }}
            />
            <button type="submit" className="navbar-search-button" style={{ backgroundColor: '#2563eb', border: 'none', borderRadius: '50%', width: '36px', height: '36px', color: 'white', fontSize: '18px', cursor: 'pointer' }}>
              <span role="img" aria-label="search">🔍</span>
            </button>
          </form>
          <Link
            to="/"
            className="navbar-mobile-link"
            onClick={() => setIsMenuOpen(false)}
            style={{ padding: '8px 0', color: 'white', textDecoration: 'none', fontWeight: '600' }}
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
            style={{ padding: '8px 0', color: 'white', textDecoration: 'none', fontWeight: '600' }}
          >
            Products
          </Link>
          {!user ? (
            <>
              <Link
                to="/login"
                className="navbar-mobile-link"
                onClick={() => setIsMenuOpen(false)}
                style={{ padding: '8px 0', color: 'white', textDecoration: 'none', fontWeight: '600' }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="navbar-mobile-link"
                onClick={() => setIsMenuOpen(false)}
                style={{ padding: '8px 0', color: 'white', textDecoration: 'none', fontWeight: '600' }}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="navbar-mobile-link"
                onClick={() => setIsMenuOpen(false)}
                style={{ padding: '8px 0', color: 'white', textDecoration: 'none', fontWeight: '600' }}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="navbar-mobile-link"
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
