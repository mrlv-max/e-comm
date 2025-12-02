import React, { useState } from 'react';
import { Store, Instagram, Twitter, Mail, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setMsg('Please enter a valid email');
      return;
    }
    

    setMsg('Thanks â€” you are subscribed!');
    setEmail('');
    setTimeout(() => setMsg(''), 4000);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-white pt-12 pb-8 px-6 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2 rounded-lg shadow-md">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg text-gray-900">Artisan's Corner</div>
                <div className="text-sm text-gray-500">Unique handmade pieces from talented artisans</div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <button className="p-2 bg-white border border-gray-200 rounded-full hover:bg-black hover:text-white transition-colors"><Instagram className="w-4 h-4" /></button>
              <button className="p-2 bg-white border border-gray-200 rounded-full hover:bg-black hover:text-white transition-colors"><Twitter className="w-4 h-4" /></button>
              <button className="p-2 bg-white border border-gray-200 rounded-full hover:bg-black hover:text-white transition-colors"><Mail className="w-4 h-4" /></button>
            </div>
          </div>

          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/shop" className="hover:text-orange-600">All Products</Link></li>
              <li><Link to="/shop?sort=featured" className="hover:text-orange-600">Featured</Link></li>
              <li><Link to="/shop?sort=new" className="hover:text-orange-600">New Arrivals</Link></li>
              <li><Link to="/shop?category=Fashion" className="hover:text-orange-600">Fashion</Link></li>
            </ul>
          </div>

          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/help" className="hover:text-orange-600">Help Center</Link></li>
              <li><Link to="/shipping" className="hover:text-orange-600">Shipping</Link></li>
              <li><Link to="/returns" className="hover:text-orange-600">Returns</Link></li>
              <li><Link to="/contact" className="hover:text-orange-600">Contact Us</Link></li>
            </ul>
          </div>

          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Get our newsletter</h4>
            <p className="text-sm text-gray-600 mb-4">Subscribe for deals, launches and insider news.</p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <input
                aria-label="Email for newsletter"
                className="w-full px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-orange-600 hover:to-orange-700 transition-shadow shadow-md">Subscribe</button>
            </form>
            {msg && <div className="text-sm text-green-600 mt-2">{msg}</div>}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t pt-6">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>© {new Date().getFullYear()} Artisan's Corner</span>
            <span className="hidden md:inline">•</span>
            <Link to="/terms" className="hover:text-orange-600">Terms</Link>
            <span className="hidden md:inline">•</span>
            <Link to="/privacy" className="hover:text-orange-600">Privacy</Link>
          </div>

          <div className="flex items-center gap-4 justify-end">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CreditCard className="w-4 h-4" />
              <span>Secured payments</span>
            </div>
            <div>
              <button onClick={scrollToTop} className="text-sm text-gray-600 hover:text-orange-600">Back to top</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
