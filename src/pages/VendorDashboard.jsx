import React, { useEffect, useState } from 'react';
import { fetchVendorAnalytics, fetchVendorRating, fetchMyShop } from '../api';
import { useSelector } from 'react-redux';

function VendorDashboard() {
  const user = useSelector(state => state.auth.user);
  const [analytics, setAnalytics] = useState(null);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        

        const shopRes = await fetchMyShop();
        const shopId = shopRes?.data?.id;
        if (!shopId) throw new Error('Vendor shop not found');
        const [aRes, rRes] = await Promise.all([fetchVendorAnalytics(shopId), fetchVendorRating(shopId)]);
        setAnalytics(aRes.data);
        setRating(rRes.data);
      } catch (err) {
        const msg = err?.response?.data?.message || err.message || 'Failed to load analytics';
        setError(msg);
      } finally { setLoading(false); }
    }
    load();
  }, [user]);

  if (!user) return <div className="p-6">Please log in as a vendor to view your dashboard.</div>;
  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Vendor Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Total Orders</div>
          <div className="text-2xl font-semibold">{analytics?.totalOrders ?? 0}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="text-2xl font-semibold">{analytics?.totalRevenue != null ? (analytics.totalRevenue/100).toFixed(2) : '0.00'}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Average Rating</div>
          <div className="text-2xl font-semibold">{rating?.averageRating ?? 'N/A'}</div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Top Products</h3>
        <ul>
          {analytics?.topProducts?.length ? analytics.topProducts.map(p => (
            <li key={p.productId} className="py-2 border-b last:border-b-0 flex justify-between">
              <div>{p.name}</div>
              <div className="text-sm text-gray-600">Qty: {p.qty}  ${(p.revenue/100).toFixed(2)}</div>
            </li>
          )) : <li className="text-sm text-gray-500">No sales yet.</li>}
        </ul>
      </div>
    </div>
  );
}

export default VendorDashboard;

