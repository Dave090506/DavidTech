import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import { supabase } from "../services/supabaseClient";

function OrderSuccess({ setCart }) {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const pendingOrderId = searchParams.get("orderId");

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const verifyPayment = async () => {
      if (!reference) {
        if (!pendingOrderId) {
          setMessage("No order information was found.");
          setLoading(false);
          return;
        }

        try {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.getSession();

          if (sessionError || !sessionData.session) {
            throw new Error("Please log in to view your order.");
          }

          const { data: order, error } = await supabase
            .from("orders")
            .select("id, payment_method, payment_status")
            .eq("id", pendingOrderId)
            .eq("user_id", sessionData.session.user.id)
            .single();

          if (error || !order) {
            throw new Error("Order not found.");
          }

          if (
            !["bank_transfer", "pay_on_delivery"].includes(order.payment_method)
          ) {
            throw new Error("This order requires payment verification.");
          }

          if (!cancelled) {
            setOrderId(order.id);
            setMessage(
              order.payment_status === "paid"
                ? "Your order has been paid."
                : "Your order was placed successfully. Payment is pending.",
            );
            setOrderPlaced(true);
          }
        } catch (error) {
          if (!cancelled) {
            setMessage(error.message || "Unable to load order.");
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }

        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke(
          "verify-paystack-payment",
          {
            body: { reference },
          },
        );

        if (cancelled) return;

        if (error) {
          throw new Error(
            "Payment verification could not be completed. Please try again.",
          );
        }

        if (data?.verified === true && data?.orderId) {
          setVerified(true);
          setOrderId(data.orderId);
          setMessage("Your payment has been verified successfully.");

          const clearedOrderKey = `davidtech_cleared_order_${data.orderId}`;

          if (!localStorage.getItem(clearedOrderKey)) {
            setCart([]);
            localStorage.setItem(clearedOrderKey, "true");
          }

          sessionStorage.removeItem("davidtech_checkout_request_id");
          sessionStorage.removeItem("davidtech_checkout_fingerprint");
        } else {
          setMessage(
            data?.message || "Your payment has not been confirmed yet.",
          );
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error.message || "An error occurred during verification.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [reference, pendingOrderId, setCart]);

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full text-center">
        {loading ? (
          <>
            <FaSpinner className="text-5xl text-blue-600 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verifying Payment...
            </h1>
            <p className="text-gray-600">
              Please wait while we confirm your payment with Paystack.
            </p>
          </>
        ) : verified ? (
          <>
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />

            <h1 className="text-3xl font-bold text-green-600 mb-4">
              Payment Successful!
            </h1>

            <p className="text-gray-600 mb-4">{message}</p>

            <p className="text-sm text-gray-500 mb-6 break-all">
              Order ID: {orderId}
            </p>

            <Link
              to="/orders"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              View My Orders
            </Link>
          </>
        ) : orderPlaced ? (
          <>
            <h1 className="text-3xl font-bold text-blue-600 mb-4">
              Order Placed Successfully!
            </h1>

            <p className="text-gray-600 mb-4">{message}</p>

            <p className="text-sm text-gray-500 mb-6 break-all">
              Order ID: {orderId}
            </p>

            <Link
              to="/orders"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              View My Orders
            </Link>
          </>
        ) : (
          <>
            <FaExclamationTriangle className="text-6xl text-orange-500 mx-auto mb-4" />

            <h1 className="text-2xl font-bold text-orange-600 mb-4">
              Payment Not Confirmed
            </h1>

            <p className="text-gray-600 mb-6">{message}</p>

            <Link
              to="/orders"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Check My Orders
            </Link>
          </>
        )}
      </div>
    </section>
  );
}

export default OrderSuccess;
