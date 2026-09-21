import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";

function Wishlist({ wishlist, toggleWishlist, addToCart }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-3">
        <span className="text-red-500">My</span> Wishlist
      </h1>

      <p className="text-center text-gray-500 mb-8 sm:mb-12">
        Save your favorite products for later.
      </p>

      {wishlist.length === 0 ? (
        <div className="text-center py-14 sm:py-24">
          <FaHeart className="mx-auto text-5xl sm:text-7xl text-gray-300 mb-6" />

          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Your wishlist is empty
          </h2>

          <p className="text-gray-500 mb-8">Start adding products you love.</p>

          <Link
            to="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-52 sm:h-60 lg:h-64 w-full object-contain p-4 sm:p-6"
              />

              <div className="px-4 sm:px-6 pb-5 sm:pb-6">
                <h3 className="text-lg sm:text-xl font-bold wrap-break-word">
                  {product.name}
                </h3>

                <p className="text-gray-500 mt-1">{product.brand}</p>

                <p className="text-blue-600 text-xl sm:text-2xl font-bold mt-3 wrap-break-word">
                  {product.price}
                </p>

                <div className="flex gap-2 sm:gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="flex-1 min-w-0 bg-blue-600 text-white px-3 py-3 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
                  >
                    <FaShoppingCart />
                    Add to Cart
                  </button>

                  <button
                    type="button"
                    aria-label={`Remove ${product.name} from wishlist`}
                    title="Remove from wishlist"
                    onClick={() => toggleWishlist(product)}
                    className="w-12 shrink-0 bg-red-500 text-white rounded-xl hover:bg-red-600 flex items-center justify-center"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Wishlist;
