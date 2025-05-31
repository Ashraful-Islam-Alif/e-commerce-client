import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import gearIcon from "./icon.png";
import {
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { AuthContext } from "../../../../providers/AuthProvider";

const Navbar = ({ cartItems, updateQuantity }) => {
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const cartRef = useRef(null);
  const navigate = useNavigate();

  const { user, LogOut } = useContext(AuthContext);

  const handleLogOut = () => {
    LogOut()
      .then(() => {})
      .catch((error) => console.log(error));
  };

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleCartClick = () => {
    setShowMobileMenu(false);
    navigate("/myItems");
  };

  const toggleCart = () => {
    setShowCart(!showCart);
    if (!showCart) setShowMobileMenu(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCart(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cartRef]);

  const navOptions = [
    { name: "Helmet", link: "#" },
    { name: "Tyre", link: "#" },
    { name: "Spare Parts", link: "#" },
    { name: "Engine Oil & Fluids", link: "#" },
  ];

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

          {/* Nav & Cart */}
          <div className="flex items-center gap-4">
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              {navOptions.map((option, index) => (
                <a
                  key={index}
                  href={option.link}
                  className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  {option.name}
                </a>
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
            </div>

            {/* Cart Hover Dropdown */}
            <div
              ref={cartRef}
              className="relative"
              onMouseEnter={() => setShowCart(true)}
              onMouseLeave={() => setShowCart(false)}
            >
              {/* Desktop Cart Button */}
              <div className="hidden md:block">
                <button
                  onClick={handleCartClick}
                  className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors duration-500 relative"
                >
                  <FaShoppingCart className="text-xl text-gray-700" />
                  {totalCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {totalCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Cart Button */}
              <button
                className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors duration-500 relative"
                onClick={toggleCart}
              >
                <FaShoppingCart className="text-xl text-gray-700" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {showCart && (
                <div className="absolute right-0 top-12 z-20 w-72 bg-white shadow-xl p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold">Your Cart</h3>
                    <button
                      className="md:hidden p-1"
                      onClick={() => setShowCart(false)}
                    >
                      <FaTimes className="text-gray-500" />
                    </button>
                  </div>

                  {cartItems.length === 0 ? (
                    <p className="text-sm text-gray-500">Your cart is empty</p>
                  ) : (
                    <>
                      <ul className="space-y-3 max-h-60 overflow-auto">
                        {cartItems.map((item) => (
                          <li
                            key={item.id}
                            className="flex justify-between items-center gap-3 pb-2 border-b"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-gray-500">
                                {item.quantity}x ৳{item.price}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQuantity(item.id, -1);
                                }}
                                className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                              >
                                <FaMinus className="text-xs" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQuantity(item.id, 1);
                                }}
                                className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                              >
                                <FaPlus className="text-xs" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t pt-2 mt-2">
                        <p className="font-semibold text-right">
                          Total: ৳
                          {cartItems.reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                          )}
                        </p>
                        <button className="w-full mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                          Checkout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              onClick={toggleMobileMenu}
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

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-2">
            {navOptions.map((option, index) => (
              <a
                key={index}
                href={option.link}
                className="block py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-blue-600 border-b last:border-b-0"
                onClick={() => setShowMobileMenu(false)}
              >
                {option.name}
              </a>
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
