import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Placeholder for subscription logic
    alert('Subscribed with ' + email);
    setEmail('');
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <h3 style={styles.heading}>Subscribe to our Newsletter</h3>
          <form onSubmit={handleSubscribe} style={styles.form}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Subscribe</button>
          </form>
        </div>
        <div style={styles.section}>
          <h3 style={styles.heading}>Address</h3>
          <address style={styles.text}>
            123 Online Store St.<br />
            Cityville, ST 12345<br />
            Country
          </address>
        </div>
        <div style={styles.section}>
          <h3 style={styles.heading}>Contact</h3>
          <p style={styles.text}>Email: support@onlinestore.com</p>
          <p style={styles.text}>Phone: +1 (555) 123-4567</p>
        </div>
        <div style={styles.section}>
          <h3 style={styles.heading}>Follow Us</h3>
          <div style={styles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink} aria-label="Facebook">
              <svg style={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.325v21.351C0 23.4.6 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.466.099 2.797.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.312h3.59l-.467 3.622h-3.123V24h6.116C23.4 24 24 23.4 24 22.675V1.325C24 .6 23.4 0 22.675 0z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink} aria-label="Twitter">
              <svg style={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 00-8.373 4.482A13.94 13.94 0 011.671 3.149a4.916 4.916 0 001.523 6.574 4.897 4.897 0 01-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.918 4.918 0 004.588 3.417A9.867 9.867 0 010 19.54a13.94 13.94 0 007.548 2.209c9.056 0 14.01-7.506 14.01-14.01 0-.213-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink} aria-label="Instagram">
              <svg style={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.34 3.608 1.314.975.975 1.252 2.242 1.314 3.608.058 1.266.07 1.645.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.34 2.633-1.314 3.608-.975.975-2.242 1.252-3.608 1.314-1.266.058-1.645.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.34-3.608-1.314-.975-.975-1.252-2.242-1.314-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.34-2.633 1.314-3.608.975-.975 2.242-1.252 3.608-1.314C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.602.443 3.515 1.53 2.428 2.617 2.115 3.79 2.057 5.067.998 6.347.985 6.756.985 10.015s.013 3.668.072 4.948c.058 1.277.371 2.45 1.458 3.537 1.087 1.087 2.26 1.4 3.537 1.458 1.28.059 1.689.072 4.948.072s3.668-.013 4.948-.072c1.277-.058 2.45-.371 3.537-1.458 1.087-1.087 1.4-2.26 1.458-3.537.059-1.28.072-1.689.072-4.948s-.013-3.668-.072-4.948c-.058-1.277-.371-2.45-1.458-3.537C19.45.443 18.277.13 17 .072 15.72.013 15.311 0 12 0z"/>
                <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998z"/>
                <circle cx="18.406" cy="5.594" r="1.44"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div style={styles.copyRight}>
        &copy; {currentYear} Online Store. All rights reserved.
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '2rem 1rem',
    marginTop: '2rem',
    fontSize: '0.9rem',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
    padding: '0 1rem',
    justifyItems: 'stretch',
    alignItems: 'start',
  },
  section: {
    minWidth: '0',
    marginBottom: '0',
    paddingLeft: '1rem',
    paddingRight: '1rem',
  },
  lastSection: {
    minWidth: '0',
    marginBottom: '0',
    paddingLeft: '1rem',
    paddingRight: '1rem',
  },
  heading: {
    fontSize: '1.1rem',
    marginBottom: '0.75rem',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
    maxWidth: '320px',
  },
  input: {
    flex: '1',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontSize: '1rem',
    minWidth: '0',
    boxSizing: 'border-box',
  },
  button: {
    backgroundColor: '#1d4ed8',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.375rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
    whiteSpace: 'nowrap',
  },
  socialIcons: {
    display: 'flex',
    gap: '1rem',
  },
  socialLink: {
    color: '#ffffff',
    display: 'inline-block',
    width: '24px',
    height: '24px',
    transition: 'color 0.3s ease',
  },
  icon: {
    width: '24px',
    height: '24px',
  },
  text: {
    lineHeight: '1.5',
  },
  copyRight: {
    marginTop: '2rem',
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#dbeafe',
  },
};

export default Footer;
