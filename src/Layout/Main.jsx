import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../Pages/Shared/Footer/Footer";
import Navbar from "../Pages/Shared/Footer/Navbar/Navbar";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Main = () => {
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error parsing cart items:", error);
      return [];
    }
  });

  const [cartLoaded, setCartLoaded] = useState(false);

  useEffect(() => {
    setCartLoaded(true); // Ready for operations after load
  }, []);

  useEffect(() => {
    if (cartLoaded) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, cartLoaded]);

  const addToCart = (product) => {
    const { _id, image, name, price } = product;
    console.log("product info", product);
    const cartItems = {
      productId: _id,
      image: image,
      name: name,
      price: price,
    };
    axiosSecure.post("/carts", cartItems).then((res) => {
      console.log(res.data);
      if (res.data.insertedId) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: `${name} added to your cart`,
        });
      }
    });
    if (!cartLoaded) return;
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const noHeaderFooter =
    location.pathname.includes("login") ||
    location.pathname.includes("signup") ||
    location.pathname.includes("myItems");

  return (
    <div>
      {noHeaderFooter || (
        <Navbar cartItems={cartItems} updateQuantity={updateQuantity}></Navbar>
      )}
      <Outlet
        context={{ cartItems, addToCart, updateQuantity, deleteItem }}
      ></Outlet>
      {noHeaderFooter || <Footer />}
    </div>
  );
};

export default Main;
