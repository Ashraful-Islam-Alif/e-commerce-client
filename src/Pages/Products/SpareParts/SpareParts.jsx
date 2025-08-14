import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useSpareParts from "../../../hooks/useSpareParts";
import useCart from "../../../hooks/useCart";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const SpareParts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [spareParts, loading] = useSpareParts();
  const [, refetch] = useCart();
  const axiosSecure = useAxiosSecure();

  const handleAddToCart = (sparePart) => {
    if (user && user.email) {
      const cartItem = {
        productId: sparePart._id,
        name: sparePart.name,
        image: sparePart.image,
        price: sparePart.price,
        email: user.email,
        quantity: 1,
      };

      axiosSecure.post("/carts", cartItem).then((res) => {
        if (res.data.insertedId || res.data.modified) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${sparePart.name} added to your cart`,
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
        }
      });
    } else {
      Swal.fire({
        title: "Please login to add the sparePart",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login now!",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: location } });
        }
      });
    }
  };

  const handleBuyNow = (sparePart) => {
    if (user && user.email) {
      const cartItem = {
        productId: sparePart._id,
        name: sparePart.name,
        image: sparePart.image,
        price: sparePart.price,
        email: user.email,
        quantity: 1,
      };

      axiosSecure.post("/carts", cartItem).then((res) => {
        if (res.data.insertedId || res.data.modified) {
          console.log(res.data);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${sparePart.name} added to your cart`,
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
          navigate("/dashboard/myItems");
        }
      });
    } else {
      Swal.fire({
        title: "Please login to add the sparePart",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login now!",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: location } });
        }
      });
    }
  };
  return (
    <div className="p-6 mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Spare Parts Collection
      </h2>

      {loading ? (
        // show loader while data is being fetched
        <div className="text-center py-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : spareParts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No spareParts available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spareParts.map((sparePart) => (
            <div key={sparePart._id} className="card bg-base-100 shadow-xl">
              <figure>
                <img
                  src={sparePart.image}
                  alt={sparePart.name}
                  className="h-48 w-full object-contain p-4"
                />
              </figure>
              <div className="card-body text-center">
                <h2 className="text-xl font-semibold">{sparePart.name}</h2>
                <p className="text-lg font-medium text-primary">
                  ৳ {sparePart.price}
                </p>
                <div className="card-actions justify-center mt-4">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleBuyNow(sparePart)}
                  >
                    Buy Now
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => handleAddToCart(sparePart)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpareParts;
