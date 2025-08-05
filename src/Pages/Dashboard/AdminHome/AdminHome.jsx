import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Card from "./Card";
import AdminCharts from "./AdminCharts";

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/stats");
      return res.data;
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">📊 Admin Dashboard</h1>
      {/* Optional: Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card title="Revenue" value={`৳ ${data?.totalRevenue}`} />
        <Card title="Customers" value={data?.totalCustomers} />
        <Card title="Products" value={data?.totalProducts} />
        <Card title="Orders" value={data?.totalOrders} />
      </div>
      {/* ✅ Show Admin Charts */}
      {data?.monthlyStats && (
        <AdminCharts
          monthlyStats={data.monthlyStats}
          productCategories={data.productCategories}
          topSellingProducts={data.topSellingProducts}
        />
      )}
    </div>
  );
};

export default AdminHome;
