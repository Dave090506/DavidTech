import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

function Cart({ cart, increaseQuantity, decreaseQuantity, removeItem }) {
  const [shippingFee, setShippingFee] = useState(5000);
  useEffect(() => {
    const loadShippingFee = async () => {
      const { data, error } = await supabase
        .from("store_settings")
        .select("shipping_fee")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Error loading shipping fee:", error);
        return;
      }

      setShippingFee(Number(data.shipping_fee || 5000));
    };

    loadShippingFee();
  }, []);
  const subtotal = cart.reduce((total, item) => {
    const price = Number(item.price.replace(/[₦,]/g, ""));

    return total + price * item.quantity;
  }, 0);

  const shipping = subtotal > 0 ? shippingFee : 0;

  const tax = subtotal * 0.075;

  const total = subtotal + shipping + tax;
  return (
    <section className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">
        Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="bg-white shadow-md rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Your cart is empty
          </h2>

          <p className="text-gray-600 mt-3">
            Browse our products and add something to your cart.
          </p>

          <Link
            to="/products"
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-2xl p-4 sm:p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 sm:w-28 sm:h-28 object-contain shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 wrap-break-word">
                    {item.name}
                  </h2>

                  <p className="text-blue-600 font-semibold mt-1 wrap-break-word">
                    {item.price}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center justify-center text-xl font-bold"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      −
                    </button>

                    <span className="font-bold text-lg">{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                      className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center justify-center text-xl font-bold"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-gray-500">
                    Item total:{" "}
                    <span className="font-semibold text-gray-900">
                      ₦
                      {(
                        Number(item.price.replace(/[₦,]/g, "")) * item.quantity
                      ).toLocaleString()}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {cart.length > 0 && (
        <div className="mt-8 sm:mt-10 bg-white shadow-lg rounded-2xl p-4 sm:p-6 w-full max-w-md ml-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Order Summary</h2>

          <div className="flex justify-between gap-4 text-lg sm:text-xl font-bold">
            <span>Subtotal</span>
            <span className="text-right wrap-break-word">
              ₦{subtotal.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between mb-3">
            <span>Shipping</span>
            <span>₦{shipping.toLocaleString()}</span>
          </div>

          <div className="flex justify-between mb-3">
            <span>Tax (7.5%)</span>
            <span>₦{tax.toLocaleString()}</span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>

          <Link
            to="/checkout"
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center text-center"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}
    </section>
  );
}

export default Cart;
