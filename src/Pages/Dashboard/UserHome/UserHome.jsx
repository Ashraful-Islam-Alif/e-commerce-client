import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Helmet } from "react-helmet-async";
import { ShoppingCart, CheckCircle, PackageSearch, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

// console.log("user", user);
const formatMonth = (year, month) =>
  `${month < 10 ? "0" + month : month}-${year}`;

const UserHome = () => {
  const axiosSecure = useAxiosSecure();

  const { data: userStats, isLoading } = useQuery({
    queryKey: ["user-home-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/user/home");
      return res.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  const chartData = userStats.monthlyOrders?.map((m) => ({
    name: formatMonth(m._id.year, m._id.month),
    orders: m.orderCount,
  }));

  return (
    <div className="space-y-6">
      <Helmet>
        <title>User Dashboard | Home</title>
      </Helmet>

      <h1 className="text-2xl font-bold">👋 Welcome, {userStats?.name}</h1>

      {/* 👤 Profile Info */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <div className="flex items-center gap-4">
          <User className="w-10 h-10 text-blue-500" />
          <div>
            <p className="font-semibold text-lg">{userStats.name}</p>
            <p className="text-gray-600 text-sm">{userStats.email}</p>
            <p className="text-gray-600 text-sm capitalize">
              Role: {userStats.role}
            </p>
          </div>
        </div>
      </div>

      {/* 📦 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center gap-2 text-gray-500 font-medium mb-1">
            <ShoppingCart className="w-5 h-5 text-green-500" />
            <h4>Total Orders</h4>
          </div>
          <p className="text-2xl font-bold">{userStats?.totalOrders || 0}</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center gap-2 text-gray-500 font-medium mb-1">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <h4>Completed Orders</h4>
          </div>
          <p className="text-2xl font-bold">
            {userStats?.completedOrders || 0}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center gap-2 text-gray-500 font-medium mb-1">
            <PackageSearch className="w-5 h-5 text-yellow-500" />
            <h4>Pending Orders</h4>
          </div>
          <p className="text-2xl font-bold">{userStats?.pendingOrders || 0}</p>
        </div>
      </div>

      {/* 📈 Order Chart */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-xl font-semibold mb-2">Monthly Orders Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#6366f1"
              strokeWidth={3}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserHome;
