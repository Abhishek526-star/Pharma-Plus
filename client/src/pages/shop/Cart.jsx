import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateItem, removeItem } from '../../redux/slices/cartSlice';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleUpdateQty = (medicineId, currentQty, action) => {
    let newQty = currentQty;
    if (action === 'inc') newQty += 1;
    if (action === 'dec') newQty -= 1;
    dispatch(updateItem({ medicineId, quantity: newQty }));
  };

  const handleRemove = (medicineId) => {
    dispatch(removeItem(medicineId));
    toast.success('Item removed from cart');
  };

  // Calculate subtotal safely on valid items
  const validItems = (items || []).filter((item) => item && item.medicineId);

  const subtotal = validItems.reduce((acc, item) => {
    const price = item.medicineId?.price || 0;
    return acc + (price * item.quantity);
  }, 0);

  if (isLoading && validItems.length === 0) {
    return <div className="text-center py-20">Loading cart...</div>;
  }

  if (validItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add medicines to get started.</p>
        <Link to="/medicines" className="bg-brand-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-brand-700 inline-flex items-center gap-2">
          Browse Medicines <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {validItems.map((item) => (
            <div key={item.medicineId._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4 items-center">
              <Link to={`/medicines/${item.medicineId._id}`} className="w-20 h-20 bg-gray-50 rounded-md flex items-center justify-center shrink-0">
                {item.medicineId.image ? (
                  <img src={item.medicineId.image} alt={item.medicineId.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <ShoppingBag className="w-8 h-8 text-gray-300" />
                )}
              </Link>
              
              <div className="grow">
                <Link to={`/medicines/${item.medicineId._id}`} className="font-semibold text-gray-900 hover:text-brand-600 block truncate">
                  {item.medicineId.name}
                </Link>
                <p className="text-sm text-gray-500">₹{item.medicineId.price.toFixed(2)}</p>
                
                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => handleUpdateQty(item.medicineId._id, item.quantity, 'dec')}
                    className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-medium text-gray-800 w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => handleUpdateQty(item.medicineId._id, item.quantity, 'inc')}
                    className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="text-right flex flex-col items-end justify-between h-full">
                <p className="font-bold text-gray-900">₹{(item.medicineId.price * item.quantity).toFixed(2)}</p>
                <button 
                  onClick={() => handleRemove(item.medicineId._id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm pb-4 border-b border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
            </div>
            <div className="flex justify-between py-4 font-bold text-gray-900">
              <span>Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <Link 
              to="/checkout" 
              className="block w-full text-center bg-brand-600 text-white py-3 rounded-md font-semibold hover:bg-brand-700 mt-2"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;