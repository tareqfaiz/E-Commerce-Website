import React from 'react';
import './AdminFooter.css';

function AdminFooter() {
  return (
    <footer className="admin-footer">
      <p>© {new Date().getFullYear()} Admin Dashboard. All rights reserved.</p>
    </footer>
  );
}

export default AdminFooter;
