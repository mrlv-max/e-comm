import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderById } from '../api';
import formatCurrencyINR from '../utils/formatCurrency';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { data } = await fetchOrderById(id);
        if (!mounted) return;
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="p-12 text-center">Loading order...</div>;
  if (!order) return <div className="p-12 text-center">Order not found or access denied.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-gray-600">← Back</button>
      <h2 className="text-2xl font-bold mb-4">Order #{order.id}</h2>
      <div className="mb-4 text-sm text-gray-600">Placed on: {new Date(order.createdAt).toLocaleString()}</div>
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium">Status</div>
            <div className="text-sm text-gray-700">{order.status}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-medium">Total</div>
            <div className="text-sm font-semibold">{formatCurrencyINR(order.total)}</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Items</h3>
        <div className="space-y-3">
          {order.items && order.items.length ? order.items.map((it) => (
            <div key={it.id} className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
                <img src={it.product?.imageUrl || it.product?.image || 'https://placehold.co/100x100'} alt={it.product?.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{it.product?.name || 'Product'}</div>
                <div className="text-xs text-gray-500">Qty: {it.quantity} • Price: {formatCurrencyINR(it.price)}</div>
              </div>
              <div className="font-semibold">{formatCurrencyINR(it.price * it.quantity)}</div>
            </div>
          )) : (
            <div className="text-sm text-gray-500">No items found for this order.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
