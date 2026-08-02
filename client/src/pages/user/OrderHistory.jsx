import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderService } from '../../services/order.service';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMyOrders();
        setOrders(res.data.data);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      packed: 'bg-indigo-100 text-indigo-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  if (isLoading) return <div className="text-center py-20">Loading orders...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link to="/medicines" className="text-brand-600 font-medium hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID: <span className="font-mono text-gray-700">{order._id.substring(0, 8)}</span></p>
                  <p className="text-sm text-gray-500">Placed on: <span className="text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {order.medicines.slice(0, 3).map((med, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {med.quantity} x {med.name}
                      </span>
                    ))}
                    {order.medicines.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        +{order.medicines.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end justify-between">
                  <div className="flex flex-col sm:items-end gap-1">
                    <span className="text-lg font-bold text-gray-900">₹{order.totalPrice.toFixed(2)}</span>
                    <StatusBadge status={order.paymentStatus} />
                    <StatusBadge status={order.orderStatus} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;