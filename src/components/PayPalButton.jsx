import React, { useState, useEffect, useRef } from 'react';



const PAYPAL_CLIENT_ID = "AdayyqiktdOdqYdiApKXU7AbUNuZEvq6NeBGbCWaeU8bj6V6uYhdG0Oe-J71B4w5d-IKIjSdp1AR7v6V"; 

const PayPalButton = ({ amount, onSuccess }) => {
  const paypalRef = useRef();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    

    if (document.querySelector(`script[src*="client-id=${PAYPAL_CLIENT_ID}"]`)) {
      setLoaded(true);
      return;
    }

    

    const script = document.createElement("script");

    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;

    script.async = true;
    script.addEventListener("load", () => setLoaded(true));
    document.body.appendChild(script);

    return () => {
      if(document.body.contains(script)) {
        document.body.removeChild(script);
      }
    }
  }, []);

  useEffect(() => {
    if (loaded && window.paypal && paypalRef.current) {
      
      

      paypalRef.current.innerHTML = ""; 
      


      window.paypal.Buttons({
        

        style: {
          layout: 'vertical',
          shape: 'rect',
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              description: "Artisan's Corner Purchase",
              amount: { currency_code: "USD", value: amount.toFixed(2) }
            }]
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log("PayPal Order Successful:", order);
          onSuccess(order);
        },
        onError: (err) => {
          console.error("PayPal Error:", err);
          alert("Payment failed. Please try again.");
        }
      }).render(paypalRef.current);
    }
  }, [loaded, amount, onSuccess]);

  if (!loaded) return <div className="text-center p-4 text-sm text-gray-500">Loading Payment Options...</div>;

  return (
    <div>
      
      <p className="text-xs text-gray-500 text-center mb-2">
        Select <strong>Debit or Credit Card</strong> for inline payment.
      </p>
      <div ref={paypalRef} className="w-full" />
    </div>
  );
};

export default PayPalButton;
