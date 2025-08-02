// Updated ViewItems.jsx - Replace the checkout button section
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

const ViewItems = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [cart, refetch, isLoading, isError, error, increaseQty, decreaseQty] =
    useCart();

  const cartLength = cart.length;
  const subtotal = cart.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/carts/${id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Your item has been removed from cart.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Empty Cart",
        text: "Please add items to your cart before checkout.",
      });
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Helmet>
        <title>Grips & Gears | My Cart</title>
      </Helmet>

      {/* Cart Table */}
      <div className="w-full lg:w-2/3">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-left">
                <th>SL</th>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(cart) && cart.length > 0 ? (
                cart.map((item, index) => (
                  <tr key={item._id || item.id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="font-medium">{item.name}</td>
                    <td className="font-semibold">৳{item.price}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          className="btn btn-xs btn-outline"
                          disabled={item.quantity <= 1}
                          onClick={() => decreaseQty(item._id, item.quantity)}
                        >
                          <FaMinus />
                        </button>
                        <span className="min-w-[2rem] text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          className="btn btn-xs btn-outline"
                          onClick={() => increaseQty(item._id, item.quantity)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </td>
                    <td className="font-semibold">
                      ৳{item.price * (item.quantity || 1)}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-error text-white"
                        onClick={() => handleDelete(item._id)}
                        title="Remove from cart"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-6xl mb-4">🛒</div>
                      <p className="text-lg font-medium mb-2">
                        Your cart is empty
                      </p>
                      <p className="text-sm">Add some items to get started!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-1/3 bg-gray-100 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <span>
              Subtotal ({cart.length} item{cartLength !== 1 ? "s" : ""})
            </span>
            <span className="font-semibold">৳{subtotal}</span>
          </div>

          <div className="flex justify-between items-center">
            <span>Shipping Fee</span>
            <div className="flex items-center">
              <span className="line-through text-gray-500 mr-2">৳50</span>
              <span className="badge badge-success text-white px-2 py-1">
                FREE
              </span>
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-green-600">৳{subtotal}</span>
            </div>
          </div>
        </div>

        {/* Voucher Code Section */}
        <div className="mb-4">
          <div className="form-control">
            <input
              type="text"
              placeholder="Enter Voucher Code"
              className="input input-bordered w-full mb-2"
            />
            <button className="btn btn-outline btn-sm w-full">
              Apply Coupon
            </button>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleProceedToCheckout}
          disabled={cart.length === 0}
          className={`btn w-full mb-4 text-white ${
            cart.length === 0
              ? "btn-disabled"
              : "btn-success hover:btn-success-focus"
          }`}
        >
          {cart.length === 0
            ? "Cart is Empty"
            : `Proceed to Checkout (${cart.length})`}
        </button>

        {/* Additional Action Buttons */}
        {cart.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={() => navigate("/")}
              className="btn btn-outline btn-sm w-full"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/dashboard/orders")}
              className="btn btn-ghost btn-sm w-full"
            >
              View Order History
            </button>
          </div>
        )}

        {/* Payment Methods Info */}
        <div className="mt-6 p-4 bg-white rounded border">
          <h4 className="font-semibold text-sm mb-2">We Accept</h4>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>SSL Commerz</span>
            <span>•</span>
            <span>bKash</span>
            <span>•</span>
            <span>Nagad</span>
            <span>•</span>
            <span>Cards</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Secure payment powered by SSL Commerz
          </p>
        </div>

        {/* Estimated Delivery */}
        {cart.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
            <div className="flex items-center">
              <div className="text-blue-600 mr-2">🚚</div>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Free Delivery
                </p>
                <p className="text-xs text-blue-600">
                  Estimated delivery: 2-3 business days
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewItems;
