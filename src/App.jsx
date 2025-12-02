import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './redux/authSlice';
import { addToCart, removeFromCart, updateQuantity, clearCart, logoutUser } from './redux/cartSlice';

import { ShoppingCart, User, LogOut } from 'lucide-react';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductCatalog from './pages/ProductCatalog';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import VendorDashboard from './pages/VendorDashboard';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import Footer from './components/Footer';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const { user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(logoutUser());
    navigate('/login');
  };

  const handleAddToCart = (product) => dispatch(addToCart(product));
  const normalizeAndAddToCart = (product) => {
    const payload = {
      ...product,
      id: product._id || product.id,
      quantity: product.quantity || product.qty || 1,
      image: product.image || product.imageUrl || (Array.isArray(product.images) ? product.images[0] : undefined) || '',
    };
    dispatch(addToCart(payload));
  };
  const handleUpdateQuantity = (id, quantity) =>
    dispatch(updateQuantity({ id, quantity }));
  const handleRemoveItem = (id) => dispatch(removeFromCart(id));
  const handleCheckoutSuccess = () => dispatch(clearCart());
  const handleClearCart = () => dispatch(clearCart());

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 font-sans flex flex-col">
      <ScrollToTop />

      <nav className="bg-white shadow-md sticky top-0 z-40 border-b-2 border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-lg group-hover:shadow-xl transition-all">
                  AC
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent hidden sm:inline-block">
                  Artisan&apos;s Corner
                </span>
              </Link>
              
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-orange-600 px-3 py-2 font-medium text-sm transition-colors duration-200"
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  className="text-gray-700 hover:text-orange-600 px-3 py-2 font-medium text-sm transition-colors duration-200"
                >
                  Browse All
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">

              {user && user.role?.toLowerCase() === 'vendor' && (
                <div className="hidden md:flex gap-2">
                  <Link
                    to="/dashboard"
                    className="text-xs md:text-sm font-medium text-gray-700 hover:text-orange-600 px-2 md:px-3 py-1 md:py-2 rounded-md transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/vendor-analytics" 
                    className="text-xs md:text-sm font-medium text-gray-700 hover:text-orange-600 px-2 md:px-3 py-1 md:py-2 rounded-md transition-colors"
                  >
                    Analytics
                  </Link>
                </div>
              )}

              <Link
                to="/cart"
                className="text-gray-700 hover:text-orange-600 p-2 rounded-lg hover:bg-orange-50 transition-all duration-200 relative group"
              >
                <ShoppingCart className="h-6 w-6 transition-transform group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-2 md:gap-3">
                  <Link
                    to={user.role?.toLowerCase() === 'vendor' ? '/dashboard' : '/my-orders'}
                    className="text-gray-700 hover:text-orange-600 p-2 rounded-lg hover:bg-orange-50 transition-all duration-200"
                    title="My Account"
                  >
                    <User className="h-6 w-6 transition-transform hover:scale-110" />
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 md:gap-2 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <LogOut className="w-4 h-4" />{' '}
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-orange-600 px-2 md:px-3 py-2 font-medium text-sm transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ProductCatalog />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/vendor-analytics" element={<VendorDashboard />} />

          <Route path="/my-orders" element={<OrderHistoryPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />

          <Route
            path="/cart"
            element={
              <CartPage
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cartItems={cartItems}
                onCheckoutSuccess={handleCheckoutSuccess}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetailPage
                onAddToCart={normalizeAndAddToCart}
              />
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProductDetailPage
                onAddToCart={normalizeAndAddToCart}
              />
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
