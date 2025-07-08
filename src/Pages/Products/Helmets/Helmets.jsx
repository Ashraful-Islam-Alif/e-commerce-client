import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import useHelmet from "../../../hooks/useHelmet";
import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import Swal from "sweetalert2";
const Helmets = () => {
  const navigate = useNavigate();
  const [helmets] = useHelmet();
  const { addToCart } = useOutletContext();
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  const handleBuyNow = (helmet) => {
    if (user && user.email) {
      // Add to cart
      addToCart(helmet);
      // Navigate to view cart
      navigate("/myItems");
    } else {
      Swal.fire({
        title: "You are not logged In",
        text: "Please login to add to the cart!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Login!",
      }).then((result) => {
        if (result.isConfirmed) {
          //send the user to the login page
          navigate("/login", { state: { from: location } });
        }
      });
    }
  };
  return (
    <div className="p-6 mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Helmet Collection</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {helmets.map((helmet) => (
          <div key={helmet.id} className="card bg-base-100 shadow-xl">
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
                  onClick={() => addToCart(helmet)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Helmets;
