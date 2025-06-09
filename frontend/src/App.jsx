import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, createRoutesFromElements } from 'react-router-dom';
import Home from './pages/Home';
import AdminProductForm from './pages/AdminProductForm';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';
import Products from './pages/Products';
import UserProfile from './pages/UserProfile';
import UpdateUserInfo from './pages/UpdateUserInfo';
import AdminProductManagement from './pages/AdminProductManagement';
import AdminPaymentManagement from './pages/AdminPaymentManagement';
import AdminManagement from './pages/AdminManagement';
import AdminCustomerManagement from './pages/AdminCustomerManagement';
import AdminOrderManagement from './pages/AdminOrderManagement';
import AdminSubscriptionManagement from './pages/AdminSubscriptionManagement';
import AdminDeliveryManagement from './pages/AdminDeliveryManagement';
import AdminDatabaseManagement from './pages/AdminDatabaseManagement';
import AdminProductEdit from './pages/AdminProductEdit';
import AdminOrderEdit from './pages/AdminOrderEdit';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { PageProvider } from './context/PageContext';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';
import AdminFooter from './components/AdminFooter';

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
              {/* Render AdminNavbar for admin routes except admin login */}
              <Route path="/admin/*" element={<AdminNavbar />} />
              <Route path="/admin/login" element={null} />
              {/* Render Customer Navbar for other routes */}
              <Route path="*" element={<Navbar />} />
            </Routes>
          </header>
          <main className="app-main" style={{ flexGrow: 1, paddingBottom: '6rem', paddingTop: window.innerWidth <= 480 ? '56px' : '64px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/products/new" element={<AdminProductForm />} />
              <Route path="/admin/products/edit/:id" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminProductEdit />
                </ProtectedRoute>
              } />
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
              <Route path="/admin/customers" element={
                <ProtectedRoute adminOnly={true}>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <AdminCustomerManagement />
                  </React.Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute adminOnly={true}>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <AdminOrderManagement />
                  </React.Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin/orders/edit/:id" element={
                <ProtectedRoute adminOnly={true}>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <AdminOrderEdit />
                  </React.Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin/subscriptions" element={
                <ProtectedRoute adminOnly={true}>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <AdminSubscriptionManagement />
                  </React.Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin/deliveries" element={
                <ProtectedRoute adminOnly={true}>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <AdminDeliveryManagement />
                  </React.Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin/databases" element={
                <ProtectedRoute adminOnly={true}>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <AdminDatabaseManagement />
                  </React.Suspense>
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
              <Route path="/update-info" element={
                <ProtectedRoute>
                  <UpdateUserInfo />
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
            {/* Render AdminFooter for admin routes except admin login */}
            <Route path="/admin/*" element={<AdminFooter />} />
            <Route path="/admin/login" element={null} />
            {/* Render Customer Footer for other routes */}
            <Route path="*" element={<Footer />} />
          </Routes>
        </div>
      </Router>
      </PageProvider>
    </CartProvider>
  );
}

export default App;
