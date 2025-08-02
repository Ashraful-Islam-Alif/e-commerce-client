import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useCart from "../../../hooks/useCart";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useTyre from "../../../hooks/useTyre";
import Swal from "sweetalert2";

const Tyres = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [tyres, loading] = useTyre();
  const [, refetch] = useCart();
  const axiosSecure = useAxiosSecure();

  const handleAddToCart = (tyre) => {
    if (user && user.email) {
      const cartItem = {
        productId: tyre._id,
        name: tyre.name,
        image: tyre.image,
        price: tyre.price,
        email: user.email,
        quantity: 1,
      };

      axiosSecure.post("/carts", cartItem).then((res) => {
        if (res.data.insertedId || res.data.modified) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${tyre.name} added to your cart`,
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
        }
      });
    } else {
      Swal.fire({
        title: "Please login to add the tyre",
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

  const handleBuyNow = (tyre) => {
    if (user && user.email) {
      const cartItem = {
        productId: tyre._id,
        name: tyre.name,
        image: tyre.image,
        price: tyre.price,
        email: user.email,
        quantity: 1,
      };

      axiosSecure.post("/carts", cartItem).then((res) => {
        if (res.data.insertedId || res.data.modified) {
          console.log(res.data);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${tyre.name} added to your cart`,
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
          navigate("/dashboard/myItems");
        }
      });
    } else {
      Swal.fire({
        title: "Please login to add the tyre",
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
      <h2 className="text-3xl font-bold mb-6 text-center">Tyre Collection</h2>

      {loading ? (
        // show loader while data is being fetched
        <div className="text-center py-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : tyres.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No tyres available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tyres.map((tyre) => (
            <div key={tyre._id} className="card bg-base-100 shadow-xl">
              <figure>
                <img
                  src={tyre.image}
                  alt={tyre.name}
                  className="h-48 w-full object-contain p-4"
                />
              </figure>
              <div className="card-body text-center">
                <h2 className="text-xl font-semibold">{tyre.name}</h2>
                <p className="text-lg font-medium text-primary">
                  ৳ {tyre.price}
                </p>
                <div className="card-actions justify-center mt-4">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleBuyNow(tyre)}
                  >
                    Buy Now
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => handleAddToCart(tyre)}
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

export default Tyres;
