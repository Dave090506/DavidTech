import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";

function ProductCard({
  image,
  name,
  price,
  rating,
  badge,
  product,
  addToCart,
  reason,
  brand,
  wishlist,
  toggleWishlist,
}) {
  const isWishlisted = wishlist?.some((item) => item.id === product.id);
  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden sm:hover:-translate-y-2">
      {/* Badge & Wishlist */}
      <div className="flex justify-between items-center px-4 sm:px-5 pt-4 sm:pt-5 gap-3">
        {badge && (
          <span className="bg-linear-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 sm:px-4 py-1 rounded-full shadow">
            {badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white"
          }`}
          aria-label={
            isWishlisted
              ? `Remove ${name} from wishlist`
              : `Add ${name} to wishlist`
          }
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FaHeart />
        </button>
      </div>

      {/* Product Image */}
      <Link to={`/product/${product.id}`}>
        <div className="relative h-56 sm:h-60 lg:h-64 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="max-w-full max-h-full object-contain transition duration-500 sm:group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-black/40 opacity-0 sm:group-hover:opacity-100 transition duration-300 flex items-center justify-center pointer-events-none">
            <span className="bg-white text-blue-600 px-5 py-2 rounded-full font-semibold shadow-lg">
              View Details
            </span>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="px-4 sm:px-6 pb-5 sm:pb-6">
        <div className="flex items-center gap-1 text-yellow-500">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={index < rating ? "text-yellow-500" : "text-gray-300"}
            />
          ))}

          <span className="text-gray-500 text-sm ml-2">({rating}.0)</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-4 line-clamp-2">
          {name}
        </h3>
        {brand && <p className="text-sm text-gray-500 mt-1">{brand}</p>}

        <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-3 wrap-break-word">
          {price}
        </p>

        <p className="text-green-600 font-medium mt-2">✓ In Stock</p>
        {reason && (
          <p className="mt-2 text-sm text-blue-600 font-medium">💡 {reason}</p>
        )}

        <button
          type="button"
          onClick={() => addToCart(product)}
          className="mt-5 sm:mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
        >
          <FaShoppingCart />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
