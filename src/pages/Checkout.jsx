import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../context/useAuth";
import { supabase } from "../services/supabaseClient";

function Checkout(props) {
  const { user } = useAuth();

  const { cart, setCart } = props;

  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutRequestId] = useState(() => {
    const savedId = sessionStorage.getItem("davidtech_checkout_request_id");

    if (savedId) {
      return savedId;
    }

    const newId = crypto.randomUUID();

    sessionStorage.setItem("davidtech_checkout_request_id", newId);

    return newId;
  });

  const [shippingFee, setShippingFee] = useState(5000);

  const [paymentMethod, setPaymentMethod] = useState("card");

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    notes: "",
  });
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
  const navigate = useNavigate();
  const subtotal = cart.reduce((total, item) => {
    const price = Number(item.price.replace(/[₦,]/g, ""));

    return total + price * item.quantity;
  }, 0);

  const shipping = subtotal > 0 ? shippingFee : 0;

  const tax = subtotal * 0.075;

  const total = subtotal + shipping + tax;
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!user?.id) {
      toast.error("Please log in before placing an order.");
      return;
    }

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setPlacingOrder(true);

      // PAYSTACK TEST PAYMENT
      if (paymentMethod === "card") {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError || !sessionData.session) {
          throw new Error("Please log in again before making payment.");
        }

        const { data, error } = await supabase.functions.invoke(
          "initialize-paystack-payment",
          {
            body: {
              checkoutRequestId,

              cart: cart.map((item) => ({
                id: item.id,
                quantity: item.quantity,
              })),
              billing: {
                fullName: formData.fullName,
                phone: formData.phone,
                address: formData.address,
                notes: formData.notes,
              },
            },
          },
        );

        if (error) {
          throw new Error(
            "Unable to initialize Paystack payment. Please try again.",
          );
        }

        if (!data?.authorizationUrl) {
          throw new Error("Paystack did not return a payment link.");
        }

        // Keep the cart until payment has been verified.
        window.location.assign(data.authorizationUrl);
        return;
      }

      // STEP 1: Create the main order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          notes: formData.notes.trim(),
          subtotal,
          shipping,
          tax,
          total,
          status: "pending",
          payment_method: paymentMethod,
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // STEP 2: Prepare the products belonging to the order
      const orderItems = cart.map((item) => {
        const productPrice = Number(item.price.replace(/[₦,]/g, ""));

        return {
          order_id: order.id,
          product_id: String(item.id),
          product_name: item.name,
          product_image: item.image || null,
          price: productPrice,
          quantity: item.quantity,
        };
      });

      // STEP 3: Save the order products
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      // STEP 4: Clear the cart only after everything saves successfully
      setCart([]);

      toast.success("Order placed successfully!");

      navigate(`/order-success?orderId=${order.id}`);
    } catch (error) {
      console.error("Error placing order:", error);

      toast.error(error.message || "Unable to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-10 items-start">
        {/* Billing Details */}
        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">
            Billing Information
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              autoComplete="name"
              required
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
              required
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <input
              type="text"
              name="address"
              autoComplete="street-address"
              required
              placeholder="Delivery Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <textarea
              name="notes"
              placeholder="Additional Notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
              rows="4"
            />
          </div>
          <div className="mt-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Payment Method
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Pay with Paystack (Test Mode)</span>
              </label>

              <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Bank Transfer</span>
              </label>

              <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="pay_on_delivery"
                  checked={paymentMethod === "pay_on_delivery"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Pay on Delivery</span>
              </label>
            </div>

            {paymentMethod === "card" && (
              <div className="mt-5 border border-blue-200 bg-blue-50 rounded-xl p-4">
                <p className="font-semibold text-blue-900 mb-2">
                  Secure Payment with Paystack
                </p>

                <p className="text-sm text-gray-700">
                  You will be redirected to Paystack's secure checkout page to
                  complete your payment.
                </p>

                <p className="text-sm text-gray-600 mt-3">
                  Test Mode is enabled. No real money will be charged. Use
                  Paystack's official test payment details only.
                </p>
              </div>
            )}

            {paymentMethod === "bank_transfer" && (
              <div className="mt-5 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold mb-2">Bank Transfer Instructions</p>

                <p className="text-sm text-gray-700">
                  Transfer the order total to the account provided by DavidTech.
                  Your order will remain pending until payment is confirmed.
                </p>
              </div>
            )}

            {paymentMethod === "pay_on_delivery" && (
              <div className="mt-5 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  You will make payment when your order is delivered.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start gap-4 border-b pb-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold wrap-break-word">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>

                <p className="shrink-0 text-right font-medium">
                  ₦
                  {(
                    Number(item.price.replace(/[₦,]/g, "")) * item.quantity
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between gap-4">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span>Shipping</span>
              <span>₦{shipping.toLocaleString()}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span>Tax (7.5%)</span>
              <span>₦{tax.toLocaleString()}</span>
            </div>

            <hr />

            <div className="flex justify-between gap-4 text-lg sm:text-xl font-bold">
              <span>Total</span>
              <span className="text-right wrap-break-word">
                ₦{total.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className={`w-full text-white py-3 rounded-lg transition font-semibold ${
              placingOrder
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {placingOrder
              ? "Processing..."
              : paymentMethod === "card"
                ? `Pay ₦${total.toLocaleString()} & Place Order`
                : "Place Order"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
