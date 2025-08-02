import useCart from "../hooks/useCart";
import {
  FaAd,
  FaCalendar,
  FaClipboardList,
  FaHome,
  FaList,
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
const Dashboard = () => {
  const [cart] = useCart();

  //get admin value from db
  const [isAdmin] = useAdmin();

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
          {isAdmin ? (
            <>
              <li>
                <NavLink to="/dashboard/adminHome">
                  <FaHome></FaHome>
                  Admin Home
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
                <NavLink to="/dashboard/addItems">
                  <FaList></FaList>
                  Add Items
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/manageItems">
                  <FaList></FaList>
                  Manage Items
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
            </>
          ) : (
            <>
              <li>
                <NavLink to="/dashboard/userHome">
                  <FaHome></FaHome>
                  User Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/myItems">
                  <FaShoppingCart></FaShoppingCart>
                  My Cart ({cart.length})
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/myItems">
                  <FaShoppingCart></FaShoppingCart>
                  Payment History
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/orders">
                  <FaClipboardList />
                  My Orders
                </NavLink>
              </li>
              <div className="divider"></div>
              <li>
                <NavLink to="/">
                  <FaHome></FaHome>
                  Home
                </NavLink>
              </li>
            </>
          )}
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
