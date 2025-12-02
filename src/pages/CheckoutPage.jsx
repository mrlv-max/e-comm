import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { clearCart } from '../redux/cartSlice';
import formatCurrencyINR from '../utils/formatCurrency';




const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  

  const cartItems = useSelector((state) => state.cart.items);
  
  const [paypalClientId, setPaypalClientId] = useState('');
  const [loadingConfig, setLoadingConfig] = useState(true);

  

  const getToken = () => {
    return localStorage.getItem('token');
  };

  

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.quantity || 0)), 0);
  const tax = subtotal * 0.10; 

  const total = subtotal + tax;

  

  useEffect(() => {
    const getConfig = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/config/paypal');

        setPaypalClientId(data);
        setLoadingConfig(false);
      } catch (error) {
        console.error("Error loading PayPal config", error);
        setLoadingConfig(false);
      }
    };
    getConfig();
  }, []);

  

  const successPaymentHandler = async (paymentResult) => {
    try {
      const token = getToken();
      if(!token) return alert('Please log in to complete purchase');

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      

      

      const formattedItems = cartItems.map(item => ({
        productId: Number(item.id || item._id), 

        quantity: Number(item.quantity || 0)
      }));

      

      const { data } = await axios.post(
        'http://localhost:5000/api/orders',
        {
          items: formattedItems,
          paypalOrderId: paymentResult.id, 

          totalPrice: total
        },
        config
      );

      alert('Payment Successful! Order Placed.');
      dispatch(clearCart()); 

      navigate('/my-orders'); 


    } catch (error) {
      console.error("Order Save Error:", error);
      alert(error.response?.data?.message || "Payment processed but failed to save order.");
    }
  };

  if (cartItems.length === 0) {
    return <div className="p-10 text-center">Your Cart is Empty <br/><button onClick={() => navigate('/')} className="text-blue-500 underline">Go Back</button></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-8 mt-10">
      
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 font-serif">Order Summary</h2>
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center gap-4">
                <img 
                  src={(
                    item.image || item.imageUrl || (Array.isArray(item.images) ? item.images[0] : undefined) || (item.imageUrls && item.imageUrls[0]) || 'https://placehold.co/400x500?text=No+Image'

                  )} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded" 
                />
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold">{formatCurrencyINR(Number(item.price || 0) * Number(item.quantity || 0))}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 space-y-2 pt-4 border-t">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrencyINR(subtotal)}</span></div>
          <div className="flex justify-between"><span>Tax (10%)</span><span>{formatCurrencyINR(tax)}</span></div>
          <div className="flex justify-between text-xl font-bold mt-2"><span>Total</span><span>{formatCurrencyINR(total)}</span></div>
        </div>
      </div>

      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
        <h2 className="text-2xl font-bold mb-6 font-serif">Payment Method</h2>
        
        {loadingConfig ? (
          <p>Loading Payment Options...</p>
        ) : (
          <>
            {(!paypalClientId || paypalClientId === 'sb') ? (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                <p className="text-sm text-yellow-800 font-semibold">⚠️ PayPal Not Configured</p>
                <p className="text-xs text-yellow-700 mt-2">You can still complete a test order (no real payment).</p>
                <button
                  onClick={() => {
                    const testPayment = { id: 'SIM_UI_TEST_' + Date.now() };
                    successPaymentHandler(testPayment);
                  }}
                  className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Complete Test Payment
                </button>
              </div>
            ) : (
              <PayPalScriptProvider options={{ "client-id": paypalClientId, currency: "USD" }}>
                <div className="z-0">
                   <PayPalButtons 
                      style={{ layout: "vertical" }}
                      createOrder={(data, actions) => {
                        console.log('Creating PayPal order with total:', total);
                        return actions.order.create({
                          purchase_units: [{
                            amount: { 
                              currency_code: "USD",
                              value: total.toFixed(2) 
                            }
                          }]
                        });
                      }}
                      onApprove={(data, actions) => {
                        console.log('PayPal order approved:', data.orderID);
                        return actions.order.capture().then((details) => {
                          console.log('PayPal order captured:', details);
                          successPaymentHandler(details);
                        });
                      }}
                      onError={(err) => {
                        console.error('PayPal error:', err);
                        alert('PayPal error: ' + (err.message || JSON.stringify(err)));
                      }}
                   />
                </div>
              </PayPalScriptProvider>
            )}
          </>
        )}
        
        <p className="text-xs text-center text-gray-400 mt-4">
           Secure payment processed by PayPal.
        </p>
      </div>
    </div>
  );
};

export default CheckoutPage;
