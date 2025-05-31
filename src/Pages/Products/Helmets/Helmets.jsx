import vega from "./VegaCrux.jpg";
import Steelbird from "./Steelbird.jpg";
import AxorApex from "./AxorApex.webp";
import HJC from "./HJC.jpeg";
import { useNavigate, useOutletContext } from "react-router-dom";
const helmets = [
  {
    id: 1,
    name: "Vega Crux",
    price: 2500,
    image: vega,
  },
  {
    id: 2,
    name: "Steelbird",
    price: 3200,
    image: Steelbird,
  },
  {
    id: 3,
    name: "Axor Apex",
    price: 4500,
    image: AxorApex,
  },
  {
    id: 4,
    name: "HJC",
    price: 4500,
    image: HJC,
  },
];
const Helmets = () => {
  const navigate = useNavigate();

  const { addToCart } = useOutletContext();
  const handleBuyNow = (helmet) => {
    // Add to cart with quantity 1
    addToCart({ ...helmet, quantity: 1 });
    // Navigate to view cart
    navigate("/myItems");
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
