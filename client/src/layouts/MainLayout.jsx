import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import logo from "../assets/logo.png";
import { logout } from '../redux/slices/authSlice';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  User, 
  FileText, 
  Package, 
  ShieldCheck, 
  Truck, 
  HeartPulse, 
  Lock, 
  LogOut, 
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';

const MainLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useSelector((state) => state.cart);
  const cartItemCount = (items || []).reduce((acc, item) => acc + (item?.quantity || 0), 0);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      dispatch(logout());
      navigate('/');
    } finally {
      setMobileMenuOpen(false);
      setProfileDropdownOpen(false);
    }
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      {/* Top Banner / Announcement */}
      <div className="bg-brand-700 text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        <span>✨ Free delivery on orders over ₹499 | 100% Genuine Medicines Guaranteed</span>
      </div>

      {/* Main Glassmorphism Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-50 transition-all">
        <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={closeMenus}
            className="flex items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center p-1.5 border border-brand-100 group-hover:scale-105 transition-transform">
              <img
                src={logo}
                alt="PharmaPlus"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 block leading-none">
                Pharma<span className="text-brand-600">Plus</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block mt-0.5">
                Healthcare & Wellness
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/medicines"
              className={`text-sm font-semibold transition-colors ${
                isActive('/medicines') ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'
              }`}
            >
              Shop Medicines
            </Link>

            {isAuthenticated && user?.role === 'customer' && (
              <>
                <Link
                  to="/prescriptions"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/prescriptions') ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'
                  }`}
                >
                  My Prescriptions
                </Link>

                <Link
                  to="/orders"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/orders') ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'
                  }`}
                >
                  My Orders
                </Link>
              </>
            )}

            {(user?.role === 'admin' || user?.role === 'pharmacist') && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                {user.role === 'admin' ? 'Admin Panel' : 'Pharmacist Panel'}
              </Link>
            )}
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-brand-600 text-white text-[11px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center ring-2 ring-white animate-pulse">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* Auth Area */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full border border-slate-200 hover:border-brand-300 hover:bg-slate-50 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-linear-to-tr from-brand-600 to-emerald-400 text-white text-xs font-bold flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                    {user?.name || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-brand-50 text-brand-700">
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                    >
                      <User className="w-4 h-4" /> Your Profile
                    </Link>

                    {user?.role === 'customer' && (
                      <>
                        <Link
                          to="/orders"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                        >
                          <Package className="w-4 h-4" /> Order History
                        </Link>
                        <Link
                          to="/prescriptions"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                        >
                          <FileText className="w-4 h-4" /> Prescriptions
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4.5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs shadow-brand-500/20 transition-all hover:scale-102"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle & Cart */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:text-brand-600"
              aria-label="Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-brand-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/medicines"
                onClick={closeMenus}
                className="px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600"
              >
                Shop Medicines
              </Link>

              {isAuthenticated ? (
                <>
                  {user?.role === 'customer' && (
                    <>
                      <Link
                        to="/prescriptions"
                        onClick={closeMenus}
                        className="px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600"
                      >
                        My Prescriptions
                      </Link>
                      <Link
                        to="/orders"
                        onClick={closeMenus}
                        className="px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600"
                      >
                        My Orders
                      </Link>
                    </>
                  )}

                  {(user?.role === 'admin' || user?.role === 'pharmacist') && (
                    <Link
                      to="/admin"
                      onClick={closeMenus}
                      className="px-3 py-2 rounded-lg font-medium bg-slate-900 text-white"
                    >
                      Dashboard ({user?.role})
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={closeMenus}
                    className="px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600"
                  >
                    Profile ({user?.name})
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-lg font-medium text-rose-600 hover:bg-rose-50 text-left w-full"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={closeMenus}
                    className="w-full text-center py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenus}
                    className="w-full text-center py-2.5 rounded-xl bg-brand-600 text-white font-semibold shadow-xs"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="grow container mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>

      {/* Trust Badges Strip */}
      <section className="border-t border-slate-200/80 bg-white py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5 p-3 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">100% Genuine</h3>
                <p className="text-[11px] text-slate-500">Sourced from top manufacturers</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Fast Delivery</h3>
                <p className="text-[11px] text-slate-500">Express doorstep shipping</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Licensed Pharmacists</h3>
                <p className="text-[11px] text-slate-500">Prescription verified care</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Secure Payments</h3>
                <p className="text-[11px] text-slate-500">256-bit encrypted checkout</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 mt-auto border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
                  <HeartPulse className="w-5 h-5 text-brand-400" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Pharma<span className="text-brand-400">Plus</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Your certified online healthcare partner. Delivering genuine medicines, healthcare essentials, and certified consultations right to your doorstep.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Licensed & Verified Pharmacy
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Shop & Explore</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><Link to="/medicines" className="hover:text-white transition-colors">Browse Medicines</Link></li>
                <li><Link to="/prescriptions" className="hover:text-white transition-colors">Upload Prescription</Link></li>
                <li><Link to="/orders" className="hover:text-white transition-colors">Track Orders</Link></li>
                <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
              </ul>
            </div>

            {/* Support & Company */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Help & Company</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About PharmaPlus</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Customer Assurance */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Prescription Support</h4>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Need help uploading your doctor's prescription? Our licensed pharmacists are available to verify your order.
              </p>
              <Link
                to="/prescriptions"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" /> Upload Prescription
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} PharmaPlus Inc. All rights reserved.</p>
            <p className="text-slate-500">Healthcare verified • Genuine Medicines • Express Care</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;