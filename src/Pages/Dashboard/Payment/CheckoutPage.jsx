import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useCart from "../../../hooks/useCart";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [cart, refetch] = useCart();

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    country: "Bangladesh",
  });

  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  const shippingFee = 0; // Free shipping
  const totalAmount = subtotal + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const required = ["name", "email", "phone", "address", "city", "postcode"];
    for (let field of required) {
      if (!customerInfo[field]) {
        Swal.fire({
          icon: "error",
          title: "Missing Information",
          text: `Please fill in the ${field} field`,
        });
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address",
      });
      return false;
    }

    // Basic phone validation (Bangladesh format)
    const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
    if (!phoneRegex.test(customerInfo.phone)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Please enter a valid Bangladesh phone number (e.g., 01712345678)",
      });
      return false;
    }

    return true;
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (cart.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Empty Cart",
        text: "Your cart is empty. Please add items before checkout.",
      });
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        email: user.email,
        cartItems: cart,
        totalAmount: totalAmount,
        customerInfo: customerInfo,
      };

      const response = await axiosSecure.post("/payment/init", paymentData);

      if (response.data.success) {
        // Redirect to SSL Commerz payment page
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error(response.data.error || "Payment initialization failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Failed to initialize payment",
      });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button onClick={() => navigate("/")} className="btn btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Grips & Gears | Checkout</title>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  placeholder="01712345678"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="address2"
                  value={customerInfo.address2}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, etc. (optional)"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    State/Division
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={customerInfo.state}
                    onChange={handleInputChange}
                    placeholder="e.g., Dhaka"
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postcode"
                    value={customerInfo.postcode}
                    onChange={handleInputChange}
                    placeholder="e.g., 1000"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={customerInfo.country}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  <option value="Bangladesh">Bangladesh</option>
                </select>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {/* Cart Items */}
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-gray-500 text-xs">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">৳{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span>৳{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>৳{totalAmount}</span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              type="submit"
              onClick={handleProceedToPayment}
              disabled={loading || cart.length === 0}
              className={`btn w-full mt-6 ${
                loading ? "btn-disabled" : "btn-success"
              }`}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Processing...
                </>
              ) : (
                `Pay ৳${totalAmount} with SSL Commerz`
              )}
            </button>

            {/* Back to Cart */}
            <button
              onClick={() => navigate("/dashboard/myItems")}
              className="btn btn-outline w-full mt-3"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
