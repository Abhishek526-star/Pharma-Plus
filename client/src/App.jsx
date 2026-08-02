import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './redux/store';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Shop from './pages/shop/Shop';
import MedicineDetails from './pages/shop/MedicineDetails';
import Cart from './pages/shop/Cart';
import Checkout from './pages/shop/Checkout';
import MyPrescriptions from './pages/user/MyPrescriptions';
import OrderHistory from './pages/user/OrderHistory';
import Profile from './pages/user/Profile';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import AdminOrders from './pages/admin/Orders';
import VerifyPrescriptions from './pages/pharmacist/VerifyPrescriptions';
import Inventory from './pages/admin/Inventory';
import Categories from './pages/admin/Categories';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';
import { setCredentials } from './redux/slices/authSlice';
import { authService } from './services/auth.service';
import { fetchCart } from './redux/slices/cartSlice';
import About from './pages/static/About';
import Contact from './pages/static/Contact';
import PrivacyPolicy from './pages/static/PrivacyPolicy';
import Terms from './pages/static/Terms';

// Inner component that has access to Redux context
const AppRoutes = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (accessToken) {
      authService
        .getProfile()
        .then((res) => {
          dispatch(
            setCredentials({
              user: res.data.data,
              accessToken,
            })
          );

          // Load cart after restoring the user
          dispatch(fetchCart());
        })
        .catch(() => {
          localStorage.removeItem("accessToken");
        });
    }
  }, [accessToken, dispatch]);




  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public & Customer Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/medicines" element={<Shop />} />
          <Route path="/medicines/:id" element={<MedicineDetails />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/prescriptions" element={<ProtectedRoute><MyPrescriptions /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />

        </Route>

        {/* Admin & Pharmacist Routes */}
        <Route path="/admin" element={<ProtectedRoute roles={['admin', 'pharmacist']}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<ProtectedRoute roles={['admin']}><Users /></ProtectedRoute>} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="prescriptions" element={<VerifyPrescriptions />} />
          <Route path="inventory" element={<ProtectedRoute roles={['admin']}><Inventory /></ProtectedRoute>} />
          <Route path="categories" element={<ProtectedRoute roles={['admin']}><Categories /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

// Outer component that wraps everything in the Redux Provider
function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;