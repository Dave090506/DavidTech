import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import {
  FaMoneyBillWave,
  FaShoppingCart,
  FaBoxOpen,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaTruck,
} from "react-icons/fa";
import { adminSupabase } from "../services/supabaseClient";

function AdminAnalytics() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);

      const { data: ordersData, error: ordersError } = await adminSupabase
        .from("orders")
        .select("id, customer_name, total, status, created_at")
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Error loading analytics orders:", ordersError);
        setLoading(false);
        return;
      }
      const { data: productsData, error: productsError } = await adminSupabase
        .from("products")
        .select("id");

      if (productsError) {
        console.error("Error loading analytics products:", productsError);
        setLoading(false);
        return;
      }

      const { data: customersData, error: customersError } = await adminSupabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("is_admin", false);

      if (customersError) {
        console.error("Error loading analytics customers:", customersError);
        setLoading(false);
        return;
      }

      const formattedOrders = (ordersData || []).map((order) => ({
        id: order.id,
        customer: order.customer_name,
        total: Number(order.total || 0),

        status: order.status
          ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
          : "Pending",

        date: order.created_at
          ? new Date(order.created_at).toLocaleDateString()
          : "",
      }));

      setOrders(formattedOrders);
      setCustomers(customersData || []);
      setProducts(productsData || []);
      setLoading(false);
    };

    loadAnalytics();
  }, []);
  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0,
  );

  const completedOrders = orders.filter(
    (order) => order.status === "Completed",
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "Processing",
  ).length;

  const pendingOrders = orders.filter(
    (order) => !order.status || order.status === "Pending",
  ).length;

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
      title: "Total Revenue",
      value: `₦${totalRevenue.toLocaleString()}`,
      icon: <FaMoneyBillWave />,
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: <FaShoppingCart />,
    },
    {
      title: "Total Products",
      value: products.length,
      icon: <FaBoxOpen />,
    },
    {
      title: "Total Customers",
      value: customers.length,
      icon: <FaUsers />,
    },
  ];

  return (
    <section className="min-h-screen bg-gray-100 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">
          <AdminSidebar />

          <div>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Analytics
              </h1>

              <p className="text-gray-500 mt-2">
                Monitor DavidTech store performance and activity.
              </p>
            </div>

            {/* Main Statistics */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="bg-white rounded-2xl shadow-md p-5 sm:p-6 min-w-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">{stat.title}</p>

                      <h2 className="text-xl sm:text-2xl font-bold mt-2 wrap-break-word">
                        {stat.value}
                      </h2>
                    </div>

                    <div className="text-3xl text-blue-600">{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Status */}
            <div className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-md p-5 sm:p-7">
              <h2 className="text-xl sm:text-2xl font-bold mb-6">
                Order Status Overview
              </h2>

              <div className="grid sm:grid-cols-3 gap-5">
                <div className="border rounded-xl p-5">
                  <FaClock className="text-3xl text-yellow-500" />

                  <p className="text-gray-500 mt-4">Pending Orders</p>

                  <h3 className="text-3xl font-bold mt-1">{pendingOrders}</h3>
                </div>

                <div className="border rounded-xl p-5">
                  <FaTruck className="text-3xl text-blue-600" />

                  <p className="text-gray-500 mt-4">Processing Orders</p>

                  <h3 className="text-3xl font-bold mt-1">
                    {processingOrders}
                  </h3>
                </div>

                <div className="border rounded-xl p-5">
                  <FaCheckCircle className="text-3xl text-green-600" />

                  <p className="text-gray-500 mt-4">Completed Orders</p>

                  <h3 className="text-3xl font-bold mt-1">{completedOrders}</h3>
                </div>
              </div>
            </div>

            {/* Recent Sales */}
            <div className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-md p-5 sm:p-7">
              <h2 className="text-xl sm:text-2xl font-bold mb-6">
                Recent Sales Activity
              </h2>

              {loading ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">Loading analytics...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-150">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-3">Order ID</th>
                        <th className="py-3">Customer</th>
                        <th className="py-3">Total</th>
                        <th className="py-3">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="py-4 font-semibold">{order.id}</td>

                          <td className="py-4">{order.customer}</td>

                          <td className="py-4">
                            ₦{Number(order.total || 0).toLocaleString()}
                          </td>

                          <td className="py-4">
                            <span
                              className={`${getStatusStyle(
                                order.status || "Pending",
                              )} px-3 py-1 rounded-full text-sm font-semibold`}
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
                    No sales data available yet.
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

export default AdminAnalytics;
