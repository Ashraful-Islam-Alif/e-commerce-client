import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home/Home";
import ViewItems from "../Pages/ViewItems/ViewItems";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/SignUp/SignUp";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Layout/Dashboard";
import AllUsers from "../Pages/Dashboard/AllUsers/AllUsers";
import AddItems from "../Pages/Dashboard/AddItems/AddItems";
import ManageItems from "../Pages/Dashboard/ManageItems/ManageItems";
import EditItem from "../Pages/Dashboard/EditItem/EditItem";
import AdminHome from "../Pages/Dashboard/AdminHome/AdminHome";
import UserHome from "../Pages/Dashboard/UserHome/UserHome";
import CheckoutPage from "../Pages/Dashboard/Payment/CheckoutPage";
import UserOrders from "../Pages/Dashboard/Payment/UserOrders";
import PaymentFail from "../Pages/Dashboard/Payment/PaymentFail";
import PaymentCancel from "../Pages/Dashboard/Payment/PaymentCancel";
import PaymentError from "../Pages/Dashboard/Payment/PaymentError";
import PaymentSuccess from "../Pages/Dashboard/Payment/PaymentSuccess";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/signup",
        element: <SignUp></SignUp>,
      },
      {
        path: "/checkout",
        element: (
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/payment/success/:tran_id",
        element: <PaymentSuccess />,
      },
      {
        path: "/payment/fail/:tran_id",
        element: <PaymentFail></PaymentFail>,
      },
      {
        path: "/payment/cancel/:tran_id",
        element: <PaymentCancel />,
      },
      {
        path: "/payment/error",
        element: <PaymentError />,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: "adminHome",
        element: <AdminHome></AdminHome>,
      },
      {
        path: "userHome",
        element: <UserHome></UserHome>,
      },
      {
        path: "myItems",
        element: <ViewItems></ViewItems>,
      },
      {
        path: "allUsers",
        element: <AllUsers></AllUsers>,
      },
      {
        path: "addItems",
        element: <AddItems></AddItems>,
      },
      {
        path: "manageItems",
        element: <ManageItems></ManageItems>,
      },
      {
        path: "editItem/:id",
        element: <EditItem></EditItem>,
      },
      {
        path: "orders",
        element: <UserOrders />,
      },
    ],
  },
]);
