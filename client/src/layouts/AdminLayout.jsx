import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LayoutDashboard, Users, ShoppingBag, FileCheck, Package, LogOut, Tag } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import { authService } from '../services/auth.service';

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      dispatch(logout());
      navigate('/');
    }
  };

  const navLink = (to, label, Icon) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${location.pathname === to ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-4 md:min-h-screen md:fixed md:left-0 md:top-0 z-30">
        <div className="mb-8 px-4 mt-2">
          <h2 className="text-xl font-bold text-brand-600">PharmaPlus</h2>
          <p className="text-xs text-gray-500 capitalize mt-1">{user?.role} Panel</p>
        </div>
        <nav className="flex flex-col gap-1">
          {navLink('/admin', 'Dashboard', LayoutDashboard)}
          {navLink('/admin/users', 'Users', Users)}
          {navLink('/admin/orders', 'Orders', ShoppingBag)}
          {navLink('/admin/prescriptions', 'Prescriptions', FileCheck)}

          {/* Admin-only link */}
          {user?.role === 'admin' && navLink('/admin/inventory', 'Inventory', Package)}
           {user?.role === 'admin' && navLink('/admin/categories', 'Categories', Tag)}

          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-600 hover:bg-gray-100 mt-auto">
            <LogOut className="w-5 h-5" /> Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-md text-red-600 hover:bg-red-50 w-full text-left"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;