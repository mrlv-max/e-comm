import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Package, 
  Calendar, 
  CreditCard, 
  Eye, 
  Clock, 
  CheckCircle, 
  Truck, 
  AlertCircle 
} from 'lucide-react';
import formatCurrencyINR from '../utils/formatCurrency';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); 

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  

  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const { data } = await axios.get('http://localhost:5000/api/orders/my-orders', config);

        // Filter out old pending orders (older than 7 days) to remove stale pending entries
        const now = Date.now();
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        const filtered = (data || []).filter((o) => {
          if (!o) return false;
          if (!o.status) return true;
          if (o.status === 'PENDING') {
            const created = new Date(o.createdAt).getTime();
            if (now - created > sevenDaysMs) return false; // drop old pending
          }
          return true;
        });

        setOrders(filtered);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, user]);

  

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return { 
          style: 'bg-green-100 text-green-700 border-green-200', 
          icon: <CheckCircle className="w-3 h-3 mr-1" />,
          label: 'Delivered'
        };
      case 'SHIPPED':
        return { 
          style: 'bg-blue-100 text-blue-700 border-blue-200', 
          icon: <Truck className="w-3 h-3 mr-1" />,
          label: 'Shipped'
        };
      case 'PAID':
        return { 
          style: 'bg-indigo-100 text-indigo-700 border-indigo-200', 
          icon: <CreditCard className="w-3 h-3 mr-1" />,
          label: 'Paid'
        };
      default: 

        return { 
          style: 'bg-yellow-100 text-yellow-700 border-yellow-200', 
          icon: <Clock className="w-3 h-3 mr-1" />,
          label: status || 'Pending'
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <div className="flex items-center gap-3 mb-8">
        <Package className="w-8 h-8 text-black" />
        <h1 className="text-3xl font-bold font-serif">My Order History</h1>
      </div>
      
      {loading ? (
        <div className="text-center py-20">
          <p className="text-gray-500 animate-pulse">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-16 bg-gray-50 rounded-xl border border-gray-100 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start exploring our handmade collection.</p>
            <button 
                onClick={() => navigate('/')} 
                className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
                Start Shopping
            </button>
        </div>
      ) : (
        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const statusInfo = getStatusBadge(order.status);
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4 font-medium text-gray-900">
                        <span className="font-mono text-xs text-gray-400 mr-1">#</span>
                        {order.id}
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.style}`}>
                          {statusInfo.icon}
                          {statusInfo.label}
                       </span>
                    </td>
                    <td className="p-4 font-semibold text-gray-900">{formatCurrencyINR(order.total)}</td>
                    <td className="p-4">
                      {order.isPaid ? (
                        <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-1 rounded-md text-xs font-medium border border-green-100">
                          <CheckCircle className="w-3.5 h-3.5" /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2 py-1 rounded-md text-xs font-medium border border-amber-100">
                          <AlertCircle className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => navigate(`/orders/${order.id}`)} className="inline-flex items-center gap-1 text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-black hover:text-white hover:border-black transition-all text-gray-600">
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Details</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
 