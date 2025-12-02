import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice';
import PayPalButton from '../components/PayPalButton';
import formatCurrencyINR from '../utils/formatCurrency';

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const total = cartItems.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <ShoppingCart className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <Link to="/" className="text-orange-600 font-medium hover:underline">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
        
      <div className="grid lg:grid-cols-3 gap-12">
        
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-6 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.artisan}</p>
                  </div>
                  <button onClick={() => dispatch(removeFromCart(item.id))} className="text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button className="p-2 hover:bg-gray-100" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}><Minus className="w-4 h-4" /></button>
                    <span className="px-4 font-medium">{item.quantity}</span>
                    <button className="p-2 hover:bg-gray-100" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}><Plus className="w-4 h-4" /></button>
                  </div>
                  <p className="font-bold text-lg">{formatCurrencyINR(Number(item.price || 0) * Number(item.quantity || 0))}</p>
                </div>
              </div>
            </div>
          ))}

        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-8 rounded-2xl sticky top-24">
            <h3 className="font-bold text-xl text-gray-900 mb-6">Order Summary</h3>
            <div className="flex justify-between mb-4 text-gray-600"><span>Subtotal</span><span>{formatCurrencyINR(total)}</span></div>
            <div className="flex justify-between mb-6 text-gray-600"><span>Shipping</span><span>Free</span></div>
            <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-xl text-gray-900 mb-8">
              <span>Total</span><span>{formatCurrencyINR(total)}</span>
            </div>
            
            {isCheckingOut ? (
              <div className="animate-in fade-in">
                <PayPalButton 
                  amount={total} 
                  onSuccess={(order) => {
                    alert("Payment Successful! Order: " + order.id);
                    dispatch(clearCart());
                    setIsCheckingOut(false);
                  }} 
                />
                <button onClick={() => setIsCheckingOut(false)} className="w-full mt-4 text-sm text-gray-500 hover:text-black">Cancel</button>
              </div>
            ) : (
              <button 
                onClick={() => setIsCheckingOut(true)}
                className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg flex justify-center items-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
