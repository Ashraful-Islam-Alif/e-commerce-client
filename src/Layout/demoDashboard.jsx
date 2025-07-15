import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  ChevronDown,
  Menu,
  X,
  Home,
  User,
  Settings,
  LogOut,
  BarChart3,
  ShoppingBag,
} from "lucide-react";

const demoDashboard = () => {
  const [activeTab, setActiveTab] = useState("admin");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Week");

  // Sample data for charts
  const salesData = [
    { name: "Jan", sales: 240, visitors: 180, products: 120 },
    { name: "Feb", sales: 300, visitors: 220, products: 150 },
    { name: "Mar", sales: 280, visitors: 200, products: 130 },
    { name: "Apr", sales: 350, visitors: 280, products: 180 },
    { name: "May", sales: 320, visitors: 260, products: 160 },
    { name: "Jun", sales: 380, visitors: 300, products: 200 },
    { name: "Jul", sales: 420, visitors: 340, products: 220 },
    { name: "Aug", sales: 360, visitors: 290, products: 190 },
  ];

  const earningsData = [
    { name: "Jan", earnings: 1200 },
    { name: "Feb", earnings: 1800 },
    { name: "Mar", earnings: 1600 },
    { name: "Apr", earnings: 2200 },
    { name: "May", earnings: 1900 },
    { name: "Jun", earnings: 2400 },
    { name: "Jul", earnings: 2100 },
    { name: "Aug", earnings: 1800 },
  ];

  const topProducts = [
    {
      name: "Quaker Oats Healthy Meal...",
      items: 500,
      couponCode: "2415",
      sales: "5.29%",
      amount: "$73.00",
    },
    {
      name: "Premium Helmet Series",
      items: 324,
      couponCode: "1892",
      sales: "4.15%",
      amount: "$156.00",
    },
    {
      name: "Engine Oil Premium",
      items: 298,
      couponCode: "1653",
      sales: "3.89%",
      amount: "$89.50",
    },
    {
      name: "Spare Parts Kit",
      items: 256,
      couponCode: "1432",
      sales: "3.12%",
      amount: "$123.75",
    },
  ];

  const countryData = [
    { country: "USA", flag: "🇺🇸", sales: 6546, date: "04 Jul 2024" },
    { country: "Canada", flag: "🇨🇦", sales: 4321, date: "04 Jul 2024" },
    { country: "UK", flag: "🇬🇧", sales: 3876, date: "04 Jul 2024" },
    { country: "Germany", flag: "🇩🇪", sales: 2954, date: "04 Jul 2024" },
  ];

  const AdminSidebar = () => (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-between h-16 px-4 bg-green-600">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-green-600 font-bold text-sm">EM</span>
          </div>
          <span className="ml-2 text-white font-semibold">EKOMART</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-white"
        >
          <X />
        </button>
      </div>

      <nav className="mt-8">
        <div className="px-4 space-y-2">
          <div className="text-gray-500 text-sm font-medium mb-4">
            Dashboard
          </div>
          <SidebarItem icon={Home} label="Main Demo" active />
          <SidebarItem icon={Package} label="Coming Soon" />

          <div className="text-gray-500 text-sm font-medium mb-4 mt-6">
            Management
          </div>
          <SidebarItem icon={ShoppingCart} label="Order" />
          <SidebarItem icon={Package} label="Product" />
          <SidebarItem icon={Users} label="Vendor" />
          <SidebarItem icon={BarChart3} label="Transactions" />
          <SidebarItem icon={User} label="Reviews" />
          <SidebarItem icon={Settings} label="Brand" />
          <SidebarItem icon={DollarSign} label="Payment" />
          <SidebarItem icon={User} label="User Profile" />
        </div>
      </nav>
    </div>
  );

  const SidebarItem = ({ icon: Icon, label, active }) => (
    <div
      className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${
        active
          ? "bg-green-100 text-green-700"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  const MetricCard = ({ title, value, change, color = "green" }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="flex items-center">
          <span
            className={`text-sm font-medium ${
              color === "green" ? "text-green-600" : "text-red-600"
            }`}
          >
            {change}
          </span>
          <div className="ml-2 w-16 h-8">
            <svg className="w-full h-full" viewBox="0 0 64 32">
              <path
                d="M0,20 Q16,10 32,15 T64,12"
                stroke={color === "green" ? "#10b981" : "#ef4444"}
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  const AdminDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option>Week</option>
          <option>Month</option>
          <option>Year</option>
        </select>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard title="Revenue" value="$1280" change="+50.8%" />
        <MetricCard title="Revenue" value="158" change="+50.8%" />
        <MetricCard title="Revenue" value="358" change="+50.8%" />
        <MetricCard title="Revenue" value="$89k" change="+50.8%" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Sales Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Sale Statistics
              </h3>
              <p className="text-sm text-gray-600">
                Top traffic channels metrics.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium">
                Week
              </button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium">
                Month
              </button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium">
                Year
              </button>
            </div>
          </div>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#10b981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="products"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Earnings */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Earnings</h3>
              <p className="text-sm text-gray-600">
                Top traffic channels metrics.
              </p>
            </div>
            <select className="px-3 py-1 border border-gray-300 rounded-md text-sm w-full sm:w-auto">
              <option>Week</option>
              <option>Month</option>
              <option>Year</option>
            </select>
          </div>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earnings" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Top Products
              </h3>
              <p className="text-sm text-gray-600">Top Products List</p>
            </div>
            <select className="px-3 py-1 border border-gray-300 rounded-md text-sm w-full sm:w-auto">
              <option>Week</option>
              <option>Month</option>
              <option>Year</option>
            </select>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-orange-600 font-bold text-sm">P</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[150px] sm:max-w-none">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.items} Items
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {product.amount}
                  </p>
                  <p className="text-xs text-green-600">{product.sales}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries Sales */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Top Countries Sales
              </h3>
              <p className="text-sm text-gray-600">Top Products List</p>
            </div>
            <select className="px-3 py-1 border border-gray-300 rounded-md text-sm w-full sm:w-auto">
              <option>Week</option>
              <option>Month</option>
              <option>Year</option>
            </select>
          </div>
          <div className="space-y-4">
            {countryData.map((country, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center">
                  <span className="text-xl sm:text-2xl mr-3">
                    {country.flag}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {country.country}
                    </p>
                    <p className="text-xs text-gray-500">{country.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {country.sales.toLocaleString()}
                  </p>
                  <div className="w-6 h-3 bg-green-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${Math.min(country.sales / 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const UserDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <ShoppingCart className="inline mr-2 w-4 h-4" />
            View Cart
          </button>
        </div>
      </div>

      {/* User Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard title="Total Orders" value="24" change="+12%" />
        <MetricCard title="Pending Orders" value="3" change="+5%" />
        <MetricCard title="Total Spent" value="$1,245" change="+18%" />
        <MetricCard title="Saved Items" value="12" change="+3%" />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Orders
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Product
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "#ORD-2024-001",
                  product: "Premium Helmet",
                  date: "2024-07-10",
                  status: "Delivered",
                  amount: "$156.00",
                },
                {
                  id: "#ORD-2024-002",
                  product: "Engine Oil Premium",
                  date: "2024-07-12",
                  status: "Shipped",
                  amount: "$89.50",
                },
                {
                  id: "#ORD-2024-003",
                  product: "Spare Parts Kit",
                  date: "2024-07-13",
                  status: "Processing",
                  amount: "$123.75",
                },
              ].map((order, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {order.id}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {order.product}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {order.date}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {order.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Favorite Products */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Favorite Products
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Premium Helmet Series", price: "$156.00", image: "🏍️" },
            { name: "Engine Oil Premium", price: "$89.50", image: "🛢️" },
            { name: "Spare Parts Kit", price: "$123.75", image: "🔧" },
          ].map((product, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl sm:text-4xl mb-3">{product.image}</div>
              <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
              <p className="text-lg font-bold text-green-600 mb-3">
                {product.price}
              </p>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toggle Buttons */}
      <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-2 flex space-x-2">
        <button
          onClick={() => setActiveTab("admin")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "admin"
              ? "bg-green-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Admin
        </button>
        <button
          onClick={() => setActiveTab("user")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "user"
              ? "bg-green-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          User
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      {activeTab === "admin" && <AdminSidebar />}

      {/* Main Content */}
      <div
        className={`min-h-screen ${
          activeTab === "admin" ? "lg:ml-64" : ""
        } transition-all duration-300`}
      >
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                {activeTab === "admin" && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-2"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                )}
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {activeTab === "admin" ? "Admin Dashboard" : "User Dashboard"}
                </h2>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <User className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            {activeTab === "admin" ? <AdminDashboard /> : <UserDashboard />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default demoDashboard;
