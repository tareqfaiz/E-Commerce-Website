import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminProductForm from './pages/AdminProductForm';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';
import Products from './pages/Products';
import UserProfile from './pages/UserProfile';
import AdminProductManagement from './pages/AdminProductManagement';
import AdminPaymentManagement from './pages/AdminPaymentManagement';
import AdminManagement from './pages/AdminManagement';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { PageProvider } from './context/PageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const OrderHistory = lazy(() => import('./pages/OrderHistory'));

function App() {
  return (
    <CartProvider>
      <PageProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <header className="app-header">
            {/* Conditionally render Navbar based on route */}
            <Routes>
              <Route path="/admin/*" element={null} />
              <Route path="*" element={<Navbar />} />
            </Routes>
          </header>
          <main className="app-main" style={{ flexGrow: 1, paddingBottom: '6rem', paddingTop: '64px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/products/new" element={<AdminProductForm />} />
              <Route path="/admin/products" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminProductManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/payments" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPaymentManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/admins" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="/order-history" element={
                <ProtectedRoute>
                  <Suspense fallback={<div>Loading...</div>}>
                    <OrderHistory />
                  </Suspense>
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          {/* Conditionally render Footer based on route */}
          <Routes>
            <Route path="/admin/*" element={null} />
            <Route path="*" element={<Footer />} />
          </Routes>
        </div>
      </Router>
      </PageProvider>
    </CartProvider>
  );
}

export default App;
