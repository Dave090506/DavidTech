import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuth from "../context/useAuth";

function RecentlyViewed() {
  const { user } = useAuth();
  const recentlyViewedKey = user?.id
    ? `recentlyViewed_${user.id}`
    : "recentlyViewed_guest";

  const oldRecentlyViewedKey = user?.email
    ? `recentlyViewed_${user.email}`
    : null;
  let recentlyViewed =
    JSON.parse(localStorage.getItem(recentlyViewedKey)) || [];

  if (recentlyViewed.length === 0 && oldRecentlyViewedKey) {
    const oldRecentlyViewed =
      JSON.parse(localStorage.getItem(oldRecentlyViewedKey)) || [];

    if (oldRecentlyViewed.length > 0) {
      recentlyViewed = oldRecentlyViewed;

      localStorage.setItem(
        recentlyViewedKey,
        JSON.stringify(oldRecentlyViewed),
      );
    }
  }

  return (
    <section className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">Recently Viewed</h1>

        <p className="text-gray-500">
          {recentlyViewed.length} Product
          {recentlyViewed.length !== 1 ? "s" : ""}
        </p>
      </div>

      {recentlyViewed.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {recentlyViewed.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sm:hover:shadow-xl transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-44 sm:h-52 object-contain"
              />

              <h2 className="font-bold text-lg sm:text-xl mt-5 wrap-break-word">
                {product.name}
              </h2>

              <p className="text-blue-600 font-bold mt-2 wrap-break-word">
                {product.price}
              </p>
              <Link
                to={`/product/${product.id}`}
                className="mt-5 w-full sm:w-auto inline-flex items-center justify-center bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition font-medium"
              >
                View Product
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-14 sm:py-20">
          <FaEye className="text-5xl sm:text-6xl text-gray-300 mx-auto" />

          <p className="mt-5 text-gray-500">No recently viewed products.</p>
        </div>
      )}
    </section>
  );
}

export default RecentlyViewed;
