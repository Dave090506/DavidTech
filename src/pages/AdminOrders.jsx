import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { toast } from "react-toastify";
import { adminSupabase } from "../services/supabaseClient";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);

      const { data, error } = await adminSupabase
        .from("orders")
        .select(
          `
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_image,
          price,
          quantity
        )
      `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading admin orders:", error);
        toast.error(error.message);
        setLoading(false);
        return;
      }

      const formattedOrders = (data || []).map((order) => ({
        ...order,

        customer: order.customer_name,

        date: order.created_at
          ? new Date(order.created_at).toLocaleDateString()
          : "",

        status: order.status
          ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
          : "Pending",

        subtotal: Number(order.subtotal || 0),
        shipping: Number(order.shipping || 0),
        tax: Number(order.tax || 0),
        total: Number(order.total || 0),

        items: (order.order_items || []).map((item) => ({
          id: item.id,
          productId: item.product_id,
          name: item.product_name,
          image: item.product_image,
          price: Number(item.price || 0),
          quantity: item.quantity,
        })),
      }));

      setOrders(formattedOrders);
      setLoading(false);
    };

    loadOrders();
  }, []);
  const handleStatusChange = async (newStatus) => {
    if (!selectedOrder || updatingStatus) {
      return;
    }

    setUpdatingStatus(true);

    const databaseStatus = newStatus.toLowerCase();

    const { error } = await adminSupabase
      .from("orders")
      .update({
        status: databaseStatus,
      })
      .eq("id", selectedOrder.id);

    if (error) {
      console.error("Error updating order status:", error);
      toast.error(error.message);
      setUpdatingStatus(false);
      return;
    }

    const updatedOrder = {
      ...selectedOrder,
      status: newStatus,
    };

    setSelectedOrder(updatedOrder);

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      ),
    );

    toast.success(`Order status updated to ${newStatus}.`);

    setUpdatingStatus(false);
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-500">Loading orders...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          <AdminSidebar />

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8">
              <h1 className="text-3xl sm:text-4xl font-bold">Orders</h1>

              <p className="text-gray-500 mt-2">Manage customer orders.</p>
            </div>
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-8 mt-6 sm:mt-8 overflow-x-auto">
              <table className="w-full min-w-200">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-4">Order ID</th>

                    <th>Customer</th>

                    <th>Date</th>

                    <th>Total</th>

                    <th>Status</th>

                    <th className="text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-4 font-semibold">{order.id}</td>

                        <td>{order.customer}</td>

                        <td>{order.date}</td>

                        <td className="font-semibold">
                          ₦{Number(order.total || 0).toLocaleString()}
                        </td>

                        <td>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : order.status === "Processing"
                                  ? "bg-blue-100 text-blue-700"
                                  : order.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                          >
                            {order.status || "Pending"}
                          </span>
                        </td>

                        <td className="text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowModal(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-10 text-gray-500"
                      >
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {showModal && selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowModal(false);
            setSelectedOrder(null);
          }}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-5 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedOrder(null);
              }}
              className="absolute top-5 right-5 text-2xl text-gray-500 hover:text-red-500"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8 pr-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Order Details
                </h2>

                <p className="text-gray-500 mt-1">Order #{selectedOrder.id}</p>
              </div>

              <span
                className={`px-4 py-2 rounded-full font-semibold ${
                  selectedOrder.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : selectedOrder.status === "Processing"
                      ? "bg-blue-100 text-blue-700"
                      : selectedOrder.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : selectedOrder.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                }`}
              >
                {selectedOrder.status}
              </span>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold mb-2">
                Update Order Status
              </label>

              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className="border rounded-xl p-3 w-full sm:w-64 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500">Order ID</p>
                <h3 className="font-semibold">{selectedOrder.id}</h3>
              </div>

              <div>
                <p className="text-gray-500">Customer</p>
                <h3 className="font-semibold">{selectedOrder.customer}</h3>
              </div>

              <div>
                <p className="text-gray-500">Email</p>
                <h3>{selectedOrder.email}</h3>
              </div>

              <div>
                <p className="text-gray-500">Phone</p>
                <h3>{selectedOrder.phone}</h3>
              </div>

              <div className="md:col-span-2">
                <p className="text-gray-500">Delivery Address</p>
                <h3>{selectedOrder.address}</h3>
              </div>

              <div>
                <p className="text-gray-500">Payment Method</p>
                <h3 className="font-semibold">
                  {selectedOrder.payment_method === "card"
                    ? "Debit / Credit Card"
                    : selectedOrder.payment_method === "bank_transfer"
                      ? "Bank Transfer"
                      : selectedOrder.payment_method === "pay_on_delivery"
                        ? "Pay on Delivery"
                        : "Not recorded"}
                </h3>
              </div>

              <div>
                <p className="text-gray-500">Payment Status</p>

                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedOrder.payment_status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {selectedOrder.payment_status === "paid" ? "Paid" : "Pending"}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-10 mb-5">Ordered Products</h3>

            <div className="space-y-4">
              {selectedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b pb-4"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded-lg bg-gray-100 p-2"
                    />

                    <div className="min-w-0">
                      <p className="font-semibold wrap-break-word">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="font-semibold text-blue-600 shrink-0">
                    ₦
                    {(Number(item.price || 0) * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 border-t pt-6 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₦{selectedOrder.subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₦{selectedOrder.shipping.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>₦{selectedOrder.tax.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-2xl font-bold mt-4">
                <span>Total</span>
                <span>₦{selectedOrder.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedOrder(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminOrders;
