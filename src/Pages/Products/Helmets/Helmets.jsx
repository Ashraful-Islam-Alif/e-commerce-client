import { useNavigate, useLocation } from "react-router-dom";
import useHelmet from "../../../hooks/useHelmet";
import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import Swal from "sweetalert2";
import useCart from "../../../hooks/useCart";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Helmets = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [helmets] = useHelmet();
  const [, refetch] = useCart();
  const axiosSecure = useAxiosSecure();

  const handleAddToCart = (helmet) => {
    if (user && user.email) {
      const cartItem = {
        productId: helmet._id,
        name: helmet.name,
        image: helmet.image,
        price: helmet.price,
        email: user.email,
        quantity: 1,
      };

      axiosSecure.post("/carts", cartItem).then((res) => {
        if (res.data.insertedId || res.data.modified) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${helmet.name} added to your cart`,
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
        }
      });
    } else {
      Swal.fire({
        title: "Please login to add the helmet",
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

  const handleBuyNow = (helmet) => {
    if (user && user.email) {
      const cartItem = {
        productId: helmet._id,
        name: helmet.name,
        image: helmet.image,
        price: helmet.price,
        email: user.email,
        quantity: 1,
      };

      axiosSecure.post("/carts", cartItem).then((res) => {
        if (res.data.insertedId || res.data.modified) {
          console.log(res.data);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${helmet.name} added to your cart`,
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
          navigate("/dashboard/myItems");
        }
      });
    } else {
      Swal.fire({
        title: "Please login to add the helmet",
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
      <h2 className="text-3xl font-bold mb-6 text-center">Helmet Collection</h2>

      {helmets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No helmets available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {helmets.map((helmet) => (
            <div key={helmet._id} className="card bg-base-100 shadow-xl">
              <figure>
                <img
                  src={helmet.image}
                  alt={helmet.name}
                  className="h-48 w-full object-contain p-4"
                />
              </figure>
              <div className="card-body text-center">
                <h2 className="text-xl font-semibold">{helmet.name}</h2>
                <p className="text-lg font-medium text-primary">
                  ৳ {helmet.price}
                </p>
                <div className="card-actions justify-center mt-4">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleBuyNow(helmet)}
                  >
                    Buy Now
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => handleAddToCart(helmet)}
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

export default Helmets;
