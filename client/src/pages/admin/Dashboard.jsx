import { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  CircleAlert,
  Clock,
} from "lucide-react";
import { adminService } from '../../services/admin.service';
import toast from 'react-hot-toast';
// Import Recharts components
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Custom Dark Theme Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-lg">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-green-600">₹{payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        setStats(res.data.data);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading || !stats) return <div className="text-center py-20 text-gray-400">Loading dashboard...</div>;

  const cards = [
    { title: 'Total Users', value: stats.totalUsers, change: stats.usersTrend, icon: Users, color: 'bg-blue-500' },
    { title: 'Total Orders', value: stats.totalOrders, change: stats.ordersTrend, icon: ShoppingBag, color: 'bg-purple-500' },
    { title: 'Revenue', value: `₹${stats.totalRevenue.toFixed(2)}`, change: stats.revenueTrend, icon: DollarSign, color: 'bg-green-500' },
    { title: 'Low Stock', value: stats.lowStockMedicines.length, change: null, icon: AlertTriangle, color: 'bg-red-500', isWarning: true },
  ];

  return (
    <div className="bg-gray-50 text-gray-900 rounded-xl p-6 lg:p-8 min-h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Pharmacy Dashboard
          </h1>

          <p className="mt-1 text-gray-500">
            Monitor sales, orders, inventory, and prescriptions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500">
              Last Updated
            </p>

            <p className="text-sm font-semibold text-gray-900">
              {new Date().toLocaleTimeString()}
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 border border-green-200 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>

            <span className="text-sm font-semibold text-green-700">
              System Online
            </span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div
                className={`${card.color} w-14 h-14 rounded-xl flex items-center justify-center shadow-md`}
              >
                <card.icon className="w-7 h-7 text-white" />
              </div>

              {card.change !== null ? (
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${Number(card.change) >= 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}
                >
                  {Number(card.change) >= 0 ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {Math.abs(card.change)}%
                </div>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                  Low Stock
                </span>
              )}
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-gray-500">
                {card.title}
              </p>

              <h3 className="mt-2 text-3xl font-bold text-gray-900">
                {card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {/* Revenue Chart (Recharts) */}
        <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-xl \">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <span className="text-xs text-gray-400">Last 7 days</span>
          </div>

          {/* Recharts Responsive Container */}
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyRevenue} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
                <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity & Alerts */}
        <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-xl ">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity & Alerts
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT COLUMN */}
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 h-130 overflow-y-auto">
              <div className="space-y-4">

                {stats.lowStockMedicines.length === 0 ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-green-200 bg-white shadow-sm">
                    <div className="p-2 bg-green-100 rounded-md">
                      <CircleAlert className="w-5 h-5 text-green-600" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        All Good!
                      </p>

                      <p className="text-xs text-green-600">
                        No low stock alerts
                      </p>
                    </div>
                  </div>
                ) : (
                  stats.lowStockMedicines.map((med) => (
                    <div
                      key={med._id}
                      className="flex items-center gap-3 p-5 rounded-lg border border-red-200 bg-white shadow-sm hover:shadow-md hover:border-red-300 transition-all duration-200"
                    >
                      <div className="p-2 bg-red-100 rounded-md shrink-0">
                        <CircleAlert className="w-5 h-5 text-red-600" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {med.name}
                        </p>

                        <p className=" mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                          Low stock: {med.stock} left
                        </p>
                      </div>
                    </div>
                  ))
                )}

                {/* Pending Prescriptions */}
                <div className="flex items-center gap-3 p-3 rounded-lg border border-blue-200 bg-white shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="p-2 bg-blue-100 rounded-md shrink-0">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {stats.pendingPrescriptions} Prescriptions
                    </p>

                    <p className=" mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 ">
                      Pending verification
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 h-130 overflow-y-auto">

              <h3 className="text-base font-semibold text-gray-800 uppercase tracking-wider mb-5">
                Recent Successful Orders
              </h3>

              <div className="space-y-4">

                {stats.recentOrders.length === 0 ? (
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        No recent orders
                      </p>
                      <p className="text-xs text-gray-500">
                        Completed orders will appear here.
                      </p>
                    </div>
                  </div>
                ) : (
                  stats.recentOrders.map((order) => {
                    const customerName = order.userId?.name || "Customer";

                    return (
                      <div
                        key={order._id}
                        className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-300"
                      >
                        <div className="p-2 bg-green-100 rounded-full shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>

                        <div className="flex-1">
                          <p className="text-sm text-gray-700 leading-6">
                            Order delivered successfully to{" "}
                            <span className="font-semibold text-gray-900">
                              {customerName}
                            </span>
                          </p>

                          {/* Medicine Names */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {order.medicines?.map((med, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200"
                              >
                                {med.name} × {med.quantity}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                              Delivered
                            </span>

                            <span className="text-xs text-gray-500">
                              ₹{order.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;