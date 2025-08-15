import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPageRedux';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import { AuthProvider } from './context/AuthContext';
// import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import AdminRoute from './components/AdminRoute';
// import ProductListPage from './pages/admin/ProductListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
// import UserListPage from './pages/admin/UserListPage';
// import UserEditPage from './pages/admin/UserEditPage';
// import OrderListPage from './pages/admin/OrderListPage';
import OrderEditPage from './pages/admin/OrderEditPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductPage from './pages/ProductPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import CatalogPage from './pages/CatalogPage';

function App() {
  return (
    <AuthProvider>
        <Router>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
          <Header />
          <main>
            <div className="container">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute />}>
                  <Route path="products" element={<AdminDashboard />} />
                  <Route path="products/new" element={<ProductEditPage />} />
                  <Route path="products/:id/edit" element={<ProductEditPage />} />
                  <Route path="orders/:id" element={<OrderEditPage />} />
                </Route>
              </Routes>
            </div>
          </main>
          <Footer />
        </Router>
    </AuthProvider>
  );
}

export default App;
