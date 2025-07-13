import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";

const ViewItems = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [
    cart,
    refetch,
    isLoading,
    isError,
    error,
    increaseQty,
    decreaseQty,
    removeItem,
  ] = useCart();

  const cartLength = cart.length;
  const subtotal = cart.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6">
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
                    <td>{item.name}</td>
                    <td>৳{item.price}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          className="btn btn-xs btn-outline"
                          disabled={item.quantity <= 1}
                          onClick={() => decreaseQty(item._id, item.quantity)}
                        >
                          <FaMinus />
                        </button>
                        <span className="min-w-[2rem] text-center">
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
                    <td>৳{item.price * (item.quantity || 1)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-error text-white"
                        onClick={() => removeItem(item._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    Your cart is empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-1/3 bg-gray-100 p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <div className="flex justify-between mb-2">
          <span>
            Subtotal ({cart.length} item
            {cartLength !== 1 && "s"})
          </span>
          <span>৳{subtotal}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span>Shipping Fee</span>
          <button className="btn btn-active btn-xs btn-success text-white px-1">
            Free
          </button>
        </div>
        <input
          type="text"
          placeholder="Enter Voucher Code"
          className="input input-bordered w-full mb-4"
        />
        <button className="btn btn-primary w-full mb-4">Apply</button>
        <div className="flex justify-between font-bold text-lg mb-4">
          <span>Total</span>
          <span>৳{subtotal}</span>
        </div>
        <button
          disabled={cart.length === 0}
          className={`btn w-full ${
            cart.length === 0 ? "btn-disabled" : "btn-success"
          }`}
        >
          Proceed to Checkout ({cart.length})
        </button>

        {cart.length > 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/")}
              className="btn btn-outline btn-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewItems;
