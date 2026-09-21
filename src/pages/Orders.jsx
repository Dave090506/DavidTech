import { useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";

import useAuth from "../context/useAuth";
import { supabase } from "../services/supabaseClient";
import localProducts from "../data/products";

const getOrderItemImage = (item) => {
  const localProduct = localProducts.find(
    (product) => String(product.id) === String(item.productId),
  );

  if (localProduct?.image) {
    return localProduct.image;
  }

  return item.image || "";
};
function Orders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const { data, error: ordersError } = await supabase
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
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Error loading orders:", ordersError);
        setError(ordersError.message);
        setOrders([]);
        setLoading(false);
        return;
      }

      const formattedOrders = (data || []).map((order) => ({
        ...order,

        date: order.created_at
          ? new Date(order.created_at).toLocaleDateString()
          : "",

        status: order.status
          ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
          : "Pending",

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
  }, [user?.id]);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto py-10 px-4">
        <p className="text-center text-gray-500">Loading your orders...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto py-10 px-4">
        <p className="text-center text-red-500">
          Unable to load your orders: {error}
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">My Orders</h1>

        <p className="text-gray-500">
          {orders.length} Order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <h2 className="font-bold text-lg sm:text-xl wrap-break-word">
                    Order #{order.id}
                  </h2>

                  <p className="text-gray-500">{order.date}</p>
                </div>

                <span
                  className={`inline-block w-fit px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Processing"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-5">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b py-4"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <img
                        src={getOrderItemImage(item)}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg bg-gray-100 p-2 shrink-0"
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
                      {(
                        Number(item.price || 0) * item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between gap-4 mt-5 text-lg sm:text-xl font-bold">
                <span>Total</span>
                <span className="text-right wrap-break-word">
                  ₦{Number(order.total || 0).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-14 sm:py-20">
          <FaBoxOpen className="text-5xl sm:text-6xl text-gray-300 mx-auto" />

          <p className="mt-5 text-gray-500">
            You haven't placed any orders yet.
          </p>
        </div>
      )}
    </section>
  );
}

export default Orders;
