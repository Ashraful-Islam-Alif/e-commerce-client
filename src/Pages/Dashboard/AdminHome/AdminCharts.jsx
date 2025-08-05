import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const formatMonth = (year, month) =>
  `${month < 10 ? "0" + month : month}-${year}`;

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00C49F"];

const AdminCharts = ({
  monthlyStats,
  productCategories,
  topSellingProducts,
}) => {
  const [viewType, setViewType] = useState("monthly");

  const chartData = monthlyStats.map((stat) => ({
    name: formatMonth(stat._id.year, stat._id.month),
    revenue: stat.monthlyRevenue,
    orders: stat.orderCount,
  }));

  const quarterlyData = [];
  for (let i = 0; i < monthlyStats.length; i += 3) {
    const slice = monthlyStats.slice(i, i + 3);
    if (slice.length === 3) {
      const quarterLabel = `Q${Math.floor(slice[0]._id.month / 4) + 1} ${
        slice[0]._id.year
      }`;
      const orders = slice.reduce((sum, s) => sum + s.orderCount, 0);
      quarterlyData.push({ name: quarterLabel, orders });
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <div className="bg-white shadow p-4 rounded-2xl">
          <h2 className="text-xl font-semibold mb-2">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart with Dropdown */}
        <div className="bg-white shadow p-4 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Orders</h2>
            <select
              className="border px-2 py-1 rounded text-sm"
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
            >
              <option value="monthly">Monthly Orders</option>
              <option value="quarterly">Quarterly Orders</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={viewType === "monthly" ? chartData : quarterlyData}>
              <Bar dataKey="orders" fill="#6366f1" barSize={40} />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Product Category Distribution */}
        <div className="bg-white shadow p-4 rounded-2xl">
          <h2 className="text-xl font-semibold mb-2">
            Product Category Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productCategories}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {productCategories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white shadow p-4 rounded-2xl">
          <h2 className="text-xl font-semibold mb-2">Top Selling Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSellingProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="totalSold" />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalSold" fill="#10b981" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminCharts;
