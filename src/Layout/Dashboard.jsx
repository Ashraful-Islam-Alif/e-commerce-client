import useCart from "../hooks/useCart";
import {
  FaAd,
  FaCalendar,
  FaHome,
  FaList,
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";
const Dashboard = () => {
  const [cart] = useCart();

  return (
    <div className="flex">
      {/* dashboard side bar */}
      <div className="w-70 min-h-screen bg-emerald-500 rounded shadow-xl">
        <div className="flex items-center justify-between h-16 px-4 bg-emerald-600 shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-sm">G&G</span>
            </div>
            <span className="ml-2 text-white font-semibold">Grips & Gears</span>
          </div>
        </div>
        <ul className="w-full menu p-4 text-white">
          <li>
            <NavLink to="/dashboard/userHome">
              <FaHome></FaHome>
              User Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/reservation">
              <FaCalendar></FaCalendar>
              Reservation
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/myItems">
              <FaShoppingCart></FaShoppingCart>
              My Cart ({cart.length})
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/review">
              <FaAd></FaAd>
              Add a Review
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/bookings">
              <FaList></FaList>
              My Bookings
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/allUsers">
              <FaList></FaList>
              All Users
            </NavLink>
          </li>
          <div className="divider"></div>
          <li>
            <NavLink to="/">
              <FaHome></FaHome>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/order/salad">
              <FaSearch></FaSearch>
              Menu
            </NavLink>
          </li>
        </ul>
      </div>
      {/* dashboard content */}
      <div className="flex-1 p-8">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Dashboard;
