import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

import gearIcon from "./icon.png";
import { AuthContext } from "../../../../providers/AuthProvider";
import useCart from "../../../../hooks/useCart";

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const cartRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, LogOut } = useContext(AuthContext);
  const [cart] = useCart();

  const handleLogOut = () => {
    LogOut()
      .then(() => {
        Swal.fire({
          title: "Logged out successfully!",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      })
      .catch((error) => console.log(error));
  };

  const handleAuthNavigation = () => {
    Swal.fire({
      title: "You are not logged In",
      text: "Please login to access your cart!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Login!",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login", { state: { from: location } });
      }
    });
  };

  const handleCartClick = () => {
    if (user?.email) {
      setShowMobileMenu(false);
      navigate("/myItems");
    } else {
      handleAuthNavigation();
    }
  };

  const toggleCart = () => {
    if (user?.email) {
      setShowCart(!showCart);
      if (!showCart) setShowMobileMenu(false);
    } else {
      handleAuthNavigation();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCart(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Helmet", path: "/" },
    { name: "Tyre", path: "#" },
    { name: "Spare Parts", path: "#" },
    { name: "Engine Oil & Fluids", path: "#" },
  ];

  const navItems = (
    <>
      {navLinks.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
        >
          {item.name}
        </Link>
      ))}
      {user ? (
        <button
          onClick={handleLogOut}
          className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors duration-200"
        >
          Logout
        </button>
      ) : (
        <Link
          to="/login"
          className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
        >
          Login
        </Link>
      )}
    </>
  );

  return (
    <div className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <img src={gearIcon} alt="Gear Icon" className="w-8 h-8" />
              <span className="hidden sm:block">Grips & Gears</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">{navItems}</div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <button
              onClick={handleCartClick}
              className="relative p-2 rounded-full hover:bg-gray-100 transition duration-300"
            >
              <FaShoppingCart className="text-xl text-gray-700" />
              <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart?.length || 0}
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 transition duration-200"
            >
              {showMobileMenu ? (
                <FaTimes className="text-xl text-gray-700" />
              ) : (
                <FaBars className="text-xl text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-2">
            {navLinks.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="block py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-blue-600 border-b last:border-b-0"
                onClick={() => setShowMobileMenu(false)}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => {
                  handleLogOut();
                  setShowMobileMenu(false);
                }}
                className="block w-full text-left py-3 px-4 text-red-600 hover:bg-gray-100 hover:text-red-800 border-t"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setShowMobileMenu(false)}
                className="block py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-blue-600 border-t"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
