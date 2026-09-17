import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";

import { orderService } from "../../services/order.service";
import { paymentService } from "../../services/payment.service";
import { clearCartState } from "../../redux/slices/cartSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: user?.address || "",
    },
  });

  useEffect(() => {
    if (items && items.length === 0) {
      navigate('/medicines');
    }
  }, [items, navigate]);

  const subtotal = items.reduce((total, item) => {
    return total + (item.medicineId?.price || 0) * item.quantity;
  }, 0);

  const handleRazorpayPayment = (razorpayData) => {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK failed to load.");
      setIsPlacingOrder(false);
      return;
    }

    const options = {
      key: razorpayData.key_id,
      amount: razorpayData.amount,
      currency: razorpayData.currency,
      name: "PharmaPlus",
      description: "Medicine Order Payment",
      order_id: razorpayData.razorpayOrderId,

      handler: async (response) => {
        try {
          const verifyRes = await paymentService.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: razorpayData.orderId,
          });

          if (verifyRes.data?.data?.success) {
            dispatch(clearCartState());

            toast.success("Payment Successful! Order placed.");

            setIsPlacingOrder(false);

            navigate("/", { replace: true });
          } else {
            toast.error("Payment verification failed.");
            setIsPlacingOrder(false);
          }
        } catch (error) {
          console.error(error);

          toast.error(
            error.response?.data?.message ||
              "Payment verification failed."
          );

          setIsPlacingOrder(false);
        }
      },

      prefill: {
        name: razorpayData.user?.name || "",
        email: razorpayData.user?.email || "",
        contact: razorpayData.user?.phone || "",
      },

      theme: {
        color: "#16a34a",
      },

      modal: {
        ondismiss: () => {
          toast.error("Payment cancelled.");
          setIsPlacingOrder(false);
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const onSubmit = async (data) => {
    try {
      setIsPlacingOrder(true);

      // Create Order
      const orderRes = await orderService.createOrder({
        deliveryAddress: data.address,
      });

      const orderId = orderRes.data.data._id;

      // Create Razorpay Order
      const razorpayRes = await paymentService.createOrder(orderId);

      handleRazorpayPayment(razorpayRes.data.data);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to initiate checkout."
      );

      setIsPlacingOrder(false);
    }
  };

  if (!items.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid lg:grid-cols-3 gap-8"
      >
        {/* Shipping Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Delivery Details
              </h2>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>

                <input
                  type="text"
                  readOnly
                  defaultValue={user?.name || ""}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>

                <input
                  type="text"
                  readOnly
                  defaultValue={user?.phone || ""}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>

                <textarea
                  rows={3}
                  placeholder="Enter your delivery address"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-brand-500 focus:border-brand-500"
                  {...register("address", {
                    required: "Delivery address is required",
                  })}
                />

                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-brand-600" />

              <h2 className="text-lg font-semibold text-gray-900">
                Payment Method
              </h2>
            </div>

            <div className="p-3 rounded-md border bg-gray-50 text-sm text-gray-700">
              You will pay securely using Razorpay.
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pb-4 border-b">
              {items.map((item) => (
                <div
                  key={item.medicineId?._id}
                  className="flex justify-between text-sm"
                >
                  <div className="flex gap-2">
                    <span className="font-medium">
                      {item.quantity} ×
                    </span>

                    <span className="truncate">
                      {item.medicineId?.name}
                    </span>
                  </div>

                  <span className="font-medium">
                    ₹
                    {(
                      (item.medicineId?.price || 0) *
                      item.quantity
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>

              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm mb-4">
              <span>Shipping</span>

              <span className="text-green-600">Free</span>
            </div>

            <div className="flex justify-between border-t pt-4 font-bold text-lg">
              <span>Total</span>

              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={isPlacingOrder}
              className="w-full mt-5 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-md disabled:opacity-50"
            >
              {isPlacingOrder ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;