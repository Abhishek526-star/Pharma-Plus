import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import logo from "../assets/logo.png"; // Update the path as needed
import { logout } from '../redux/slices/authSlice';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';




const MainLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart); // Get cart items
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      // Even if API call fails, clear local state
      dispatch(logout());
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">


          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold font-lora text-brand-600"
          >
            <img
              src={logo}
              alt="PharmaPlus Logo"
              className="w-20 h-20 object-contain"
            />

            <span>
              Pharma<span className="text-orange-500">Plus</span>
            </span>
          </Link>

          <nav className="space-x-4 flex items-center">


            {isAuthenticated ? (
              <>
                {/* Customer Only Navigation */}
                {user?.role === "customer" && (
                  <>
                    <Link to="/cart" className="relative text-gray-600 hover:text-brand-600 p-2">
                      <ShoppingCart className="w-6 h-6" />
                      {cartItemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/medicines"
                      className="text-gray-600 hover:text-brand-600 font-medium hidden sm:block"
                    >
                      Shop
                    </Link>

                    <Link
                      to="/prescriptions"
                      className="text-gray-600 hover:text-brand-600 font-medium hidden sm:block"
                    >
                      My Prescriptions
                    </Link>

                    <Link
                      to="/orders"
                      className="text-gray-600 hover:text-brand-600 font-medium hidden sm:block"
                    >
                      My Orders
                    </Link>
                  </>
                )}

                {/* Admin & Pharmacist Dashboard */}
                {(user?.role === "admin" || user?.role === "pharmacist") && (
                  <Link
                    to="/admin"
                    className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 hidden sm:block"
                  >
                    Dashboard
                  </Link>
                )}

                {/* Common for all authenticated users */}
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-brand-600 font-medium"
                >
                  Logout
                </button>

                <Link
                  to="/profile"
                  className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-brand-600 font-medium"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

        </div>
      </header>

      <main className="grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white pt-12 pb-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold text-brand-400 mb-4">PharmaPlus</h3>
              <p className="text-gray-400 text-sm">Your trusted online pharmacy for health and wellness. Delivering genuine medicines to your doorstep.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/medicines" className="hover:text-white transition-colors">Browse Medicines</Link></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} PharmaPlus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;