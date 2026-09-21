import { Link } from "react-router-dom";

function OrderSuccess() {
  const orderNumber = "DT-100001";

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white shadow-xl rounded-xl p-10 text-center max-w-lg w-full">
        <div className="text-6xl mb-5">✅</div>

        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Order Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for shopping with <strong>DavidTech</strong>.
        </p>

        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-gray-500">Order Number</p>

          <p className="text-2xl font-bold">{orderNumber}</p>
        </div>

        <p className="text-gray-500 mb-8">
          Your order has been received and is being processed.
        </p>

        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}

export default OrderSuccess;
