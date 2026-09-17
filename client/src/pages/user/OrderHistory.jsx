import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ShoppingBag, 
  MapPin, 
  CreditCard,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { orderService } from '../../services/order.service';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMyOrders();
        setOrders(res.data.data || []);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Compute active step index for order progress
  const getStepIndex = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
      case 'paid':
        return 1;
      case 'packed':
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return -1;
      case 'pending':
      default:
        return 0;
    }
  };

  const steps = [
    { label: 'Order Placed', icon: CheckCircle2 },
    { label: 'Processing', icon: Clock },
    { label: 'Dispatched', icon: Truck },
    { label: 'Delivered', icon: Package },
  ];

  const StatusBadge = ({ status, type = 'order' }) => {
    const isCancelled = status?.toLowerCase() === 'cancelled';
    const isSuccess = ['paid', 'delivered'].includes(status?.toLowerCase());
    const isWarning = ['pending', 'processing'].includes(status?.toLowerCase());

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
        isCancelled
          ? 'bg-rose-50 text-rose-700 border border-rose-200'
          : isSuccess
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : isWarning
          ? 'bg-amber-50 text-amber-700 border border-amber-200'
          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${
          isCancelled ? 'bg-rose-500' : isSuccess ? 'bg-emerald-500' : 'bg-amber-500'
        }`} />
        {type === 'payment' ? `Payment: ${status}` : status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48 mb-6"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 h-56"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-brand-600" />
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track and manage your order history and live shipping updates.
          </p>
        </div>

        <Link
          to="/medicines"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-xs"
        >
          Shop More <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4 border border-brand-100">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">No orders yet</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
            You haven't placed any medicine orders. Explore our verified pharmacy catalog to get started.
          </p>
          <Link
            to="/medicines"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 shadow-md shadow-brand-600/20"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStep = getStepIndex(order.orderStatus);
            const isCancelled = order.orderStatus?.toLowerCase() === 'cancelled';

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order</span>
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:text-right">
                    <StatusBadge status={order.paymentStatus} type="payment" />
                    <StatusBadge status={order.orderStatus} />
                    <span className="text-lg font-black text-slate-900 sm:ml-2">
                      ₹{order.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Feature: Visual Order Status Stepper */}
                {!isCancelled ? (
                  <div className="py-6 border-b border-slate-100">
                    <div className="grid grid-cols-4 relative">
                      {/* Stepper Progress Bar */}
                      <div className="absolute top-4 left-[12.5%] right-[12.5%] h-1 bg-slate-100 -z-0">
                        <div
                          className="h-full bg-brand-600 transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (currentStep / (steps.length - 1)) * 100)}%`
                          }}
                        />
                      </div>

                      {steps.map((step, idx) => {
                        const Icon = step.icon;
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div key={idx} className="flex flex-col items-center text-center relative z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              isDone
                                ? 'bg-brand-600 text-white shadow-xs shadow-brand-600/30 ring-4 ring-white'
                                : 'bg-slate-100 text-slate-400 ring-4 ring-white'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className={`text-[11px] mt-2 font-semibold ${
                              isCurrent
                                ? 'text-brand-700 font-bold'
                                : isDone
                                ? 'text-slate-800'
                                : 'text-slate-400'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="my-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>This order has been cancelled. If any refund is due, it will be credited within 3-5 business days.</span>
                  </div>
                )}

                {/* Order Medicines List */}
                <div className="pt-5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Medicines in this order ({order.medicines?.length || 0})
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {order.medicines?.map((med, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4 text-brand-600" />
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/medicines/${med.medicineId}`}
                              className="text-xs font-bold text-slate-800 hover:text-brand-600 block truncate"
                            >
                              {med.name}
                            </Link>
                            <span className="text-[11px] text-slate-400">
                              Qty: {med.quantity}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-slate-900 shrink-0 ml-2">
                          ₹{((med.price || 0) * med.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address Pill */}
                  {order.deliveryAddress && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-700">Delivery Address:</strong> {order.deliveryAddress}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;