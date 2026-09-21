import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import {
  FaUsers,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaShoppingBag,
} from "react-icons/fa";
import { adminSupabase } from "../services/supabaseClient";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);

      const { data: profiles, error: profilesError } = await adminSupabase
        .from("profiles")
        .select("id, full_name, email, phone, address, created_at")
        .eq("is_admin", false)
        .order("created_at", { ascending: false });

      if (profilesError) {
        console.error("Error loading customers:", profilesError);
        setLoading(false);
        return;
      }

      const { data: orders, error: ordersError } = await adminSupabase
        .from("orders")
        .select("id, user_id");

      if (ordersError) {
        console.error("Error loading customer orders:", ordersError);
        setLoading(false);
        return;
      }

      const formattedCustomers = (profiles || []).map((profile) => {
        const customerOrders = (orders || []).filter(
          (order) => order.user_id === profile.id,
        );

        return {
          id: profile.id,
          fullName: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          orderCount: customerOrders.length,
        };
      });

      setCustomers(formattedCustomers);
      setLoading(false);
    };

    loadCustomers();
  }, []);

  return (
    <section className="min-h-screen bg-gray-100 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">
          <AdminSidebar />

          <div>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Customers
              </h1>

              <p className="text-gray-500 mt-2">
                View registered DavidTech customers and their order activity.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 mb-6 sm:mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaUsers className="text-2xl text-blue-600" />
                </div>

                <div>
                  <p className="text-gray-500">Registered Customers</p>

                  <h2 className="text-3xl font-bold">{customers.length}</h2>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              {loading ? (
                <div className="text-center py-16">
                  <p className="text-gray-500">Loading customers...</p>
                </div>
              ) : customers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-180">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-6 py-4">Customer</th>

                        <th className="text-left px-6 py-4">Email</th>

                        <th className="text-left px-6 py-4">Phone</th>

                        <th className="text-left px-6 py-4">Orders</th>
                      </tr>
                    </thead>

                    <tbody>
                      {customers.map((customer) => {
                        return (
                          <tr
                            key={customer.id || customer.email}
                            className="border-t hover:bg-gray-50"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <FaUser className="text-blue-600" />
                                </div>

                                <span className="font-semibold">
                                  {customer.fullName || "Customer"}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <FaEnvelope className="text-gray-400" />

                                {customer.email}
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <FaPhone className="text-gray-400" />

                                {customer.phone || "Not provided"}
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <FaShoppingBag className="text-blue-600" />

                                <span className="font-semibold">
                                  {customer.orderCount}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <FaUsers className="text-5xl text-gray-300 mx-auto" />

                  <h2 className="text-2xl font-bold mt-5">No Customers Yet</h2>

                  <p className="text-gray-500 mt-2">
                    Registered customers will appear here.
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

export default AdminCustomers;
