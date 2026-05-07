import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartSidebar from './components/cart/CartSidebar';
import LeadPopupModal from './components/common/LeadPopupModal';
import ScrollToTop from './components/common/ScrollToTop';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Addresses from './pages/Addresses';
import About from './pages/About';
import Contact from './pages/Contact';
import CustomOrder from './pages/CustomOrder';
import AdminDashboard from './pages/admin/Dashboard';
import AddProduct from './pages/admin/AddProduct';
import ManageOrders from './pages/admin/ManageOrders';

export default function App() {
  return (
    <>
      <Navbar />
      <CartSidebar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/custom-order" element={<CustomOrder />} />

        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />

        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
        <Route path="/admin/products/add" element={<AdminRoute><AddProduct /></AdminRoute>} />

        <Route path="*" element={
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <h1 className="text-gold display-1">404</h1>
            <p className="text-muted fs-5">Page not found</p>
            <a href="/" className="btn btn-gold mt-3">Go Home</a>
          </div>
        } />
      </Routes>

      <Footer />

      <LeadPopupModal />
      <ScrollToTop />

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
        toastStyle={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', background: 'var(--black-card)', color: 'var(--text-primary)' }}
      />
    </>
  );
}
