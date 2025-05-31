import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ViewItems = ({
  cartItems = [],
  updateQuantity = () => {},
  deleteItem = () => {},
}) => {
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const handleCheckout = async () => {
    navigate("/payment");
  };
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
              {Array.isArray(cartItems) && cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <tr key={item.id}>
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
                          onClick={() => updateQuantity(item.id, -1)}
                          className="btn btn-xs btn-outline"
                        >
                          <FaMinus />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="btn btn-xs btn-outline"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </td>
                    <td>৳{item.quantity * item.price}</td>
                    <td>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="btn btn-sm btn-error text-white"
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
            Subtotal ({cartItems.length} item{cartItems.length !== 1 && "s"})
          </span>
          <span>৳{subtotal}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Shipping Fee</span>
          <span>৳0</span>
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
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
          className="btn btn-success w-full"
        >
          Proceed to Checkout ({cartItems.length})
        </button>
      </div>
    </div>
  );
};

export default ViewItems;
