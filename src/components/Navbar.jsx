import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Store } from 'lucide-react';

const Navbar = ({ user, cartCount, onLogout }) => {
  return (
    <nav className="bg-white border-b border-gray-100 py-5 px-8 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">AC</div>
          <span className="text-xl font-serif font-semibold tracking-tight text-gray-900">Artisan's Corner</span>
        </Link>

        
        <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
          <Link to="/" className="hover:text-black transition-colors">Shop</Link>
          <Link to="/" className="hover:text-black transition-colors">Artisans</Link>
          <Link to="/" className="hover:text-black transition-colors">About</Link>
        </div>

        
        <div className="flex items-center gap-6 text-gray-700">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden sm:block">Hi, {user.name}</span>
              <button onClick={onLogout} className="hover:text-red-600" title="Sign Out">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hover:text-black flex items-center gap-1 text-sm font-medium">
              <User className="w-5 h-5" /> Sign In
            </Link>
          )}
          
          <Link to="/cart" className="relative hover:text-black">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
