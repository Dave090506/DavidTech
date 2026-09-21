import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import {
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaMoneyBillWave,
} from "react-icons/fa";
import { adminSupabase } from "../services/supabaseClient";
function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardOrders = async () => {
      setLoading(true);

      const { data, error } = await adminSupabase
        .from("orders")
        .select("id, customer_name, total, status, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading dashboard orders:", error);
        setLoading(false);
        return;
      }

      const formattedOrders = (data || []).map((order) => ({
        id: order.id,
        customer: order.customer_name,
        date: order.created_at
          ? new Date(order.created_at).toLocaleDateString()
          : "",
        total: Number(order.total || 0),
        status: order.status
          ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
          : "Pending",
      }));

      setOrders(formattedOrders);
      setLoading(false);
    };

    const loadCustomers = async () => {
      const { data, error } = await adminSupabase
        .from("profiles")
        .select("id, full_name, email, is_admin")
        .eq("is_admin", false);

      if (error) {
        console.error("Error loading customers:", error);
        return;
      }

      setCustomers(data || []);
    };

    const loadProducts = async () => {
      const { data, error } = await adminSupabase.from("products").select("id");

      if (error) {
        console.error("Error loading dashboard products:", error);
        return;
      }

      setProducts(data || []);
    };

    loadDashboardOrders();
    loadCustomers();
    loadProducts();
  }, []);

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0,
  );
  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "Processing":
        return "bg-blue-100 text-blue-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const stats = [
    {
      title: "Products",
      value: products.length,
      icon: <FaBoxOpen />,
      color: "bg-blue-600",
    },
    {
      title: "Orders",
      value: orders.length,
      icon: <FaShoppingCart />,
      color: "bg-green-600",
    },
    {
      title: "Customers",
      value: customers.length,
      icon: <FaUsers />,
      color: "bg-purple-600",
    },
    {
      title: "Revenue",
      value: `₦${totalRevenue.toLocaleString()}`,
      icon: <FaMoneyBillWave />,
      color: "bg-orange-500",
    },
  ];
  return (
    <section className="min-h-screen bg-gray-100 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          <AdminSidebar />

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8">
              <h1 className="text-3xl sm:text-4xl font-bold">
                Admin Dashboard
              </h1>

              <p className="text-gray-500 mt-2">Welcome back, Administrator.</p>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 min-w-0"
                >
                  <div
                    className={`${stat.color} w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl`}
                  >
                    {stat.icon}
                  </div>

                  <h3 className="text-gray-500 mt-5">{stat.title}</h3>

                  <p className="text-2xl sm:text-3xl font-bold mt-2 wrap-break-word">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-8 mt-6 sm:mt-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">Recent Orders</h2>

                <Link
                  to="/admin/orders"
                  className="text-blue-600 hover:underline"
                >
                  View All
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">Loading recent orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-175">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Order ID</th>
                        <th className="text-left py-3">Customer</th>
                        <th className="text-left py-3">Date</th>
                        <th className="text-left py-3">Total</th>
                        <th className="text-left py-3">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr
                          key={order.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-4">{order.id}</td>

                          <td>{order.customer}</td>

                          <td>{order.date}</td>

                          <td>₦{Number(order.total || 0).toLocaleString()}</td>

                          <td>
                            <span
                              className={`${getStatusStyle(
                                order.status,
                              )} px-3 py-1 rounded-full text-sm font-medium`}
                            >
                              {order.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <FaShoppingCart className="text-5xl text-gray-300 mx-auto" />

                  <p className="text-gray-500 mt-4">
                    No orders have been placed yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
