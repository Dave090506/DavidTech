import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaAward,
  FaHeart,
  FaShoppingCart,
} from "react-icons/fa";
import localProducts from "../data/products";
import { supabase } from "../services/supabaseClient";
import getRecommendations from "../utils/recommendations";
import ProductCard from "../components/ProductCard";
import RecentlyViewed from "../components/RecentlyViewed";
import useAuth from "../context/useAuth";

const getProductImage = (product) => {
  if (!product?.image) return "";

  if (
    product.image.startsWith("data:") ||
    product.image.startsWith("http://") ||
    product.image.startsWith("https://") ||
    product.image.startsWith("blob:")
  ) {
    return product.image;
  }

  const matchingLocalProduct = localProducts.find(
    (localProduct) => Number(localProduct.id) === Number(product.id),
  );

  return matchingLocalProduct?.image || "";
};
function ProductDetails({ addToCart, wishlist, toggleWishlist }) {
  const { user } = useAuth();
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProduct(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error loading product details:", error);
        setProducts([]);
        setLoadingProduct(false);
        return;
      }

      const formattedProducts = (data || []).map((product) => ({
        ...product,
        image: getProductImage(product),
      }));

      setProducts(formattedProducts);
      setLoadingProduct(false);
    };

    loadProducts();
  }, []);
  const recentlyViewedKey = user?.id
    ? `recentlyViewed_${user.id}`
    : "recentlyViewed_guest";

  const oldRecentlyViewedKey = user?.email
    ? `recentlyViewed_${user.email}`
    : null;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
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

  const product = products.find((item) => item.id === Number(id));
  const isWishlisted = wishlist.some((item) => item.id === product?.id);

  const recommendedProducts = getRecommendations(product, products);
  useEffect(() => {
    if (!product) return;

    const storedProducts =
      JSON.parse(localStorage.getItem(recentlyViewedKey)) || [];

    // Remove the current product if it already exists
    const updatedProducts = storedProducts.filter(
      (item) => item.id !== product.id,
    );

    // Add current product to the beginning
    updatedProducts.unshift(product);

    // Keep only the latest 6 products
    const limitedProducts = updatedProducts.slice(0, 6);

    localStorage.setItem(recentlyViewedKey, JSON.stringify(limitedProducts));
  }, [product, recentlyViewedKey]);

  if (loadingProduct) {
    return <div className="text-center text-xl mt-20">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center text-2xl mt-20">Product not found.</div>;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-start">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 sm:h-80 lg:h-96 object-contain"
          />
        </div>

        <div>
          {product.badge && (
            <span className="inline-block bg-red-500 text-white text-sm px-4 py-2 rounded-full">
              {product.badge}
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-5 text-gray-900 leading-tight">
            {product.name}
          </h1>

          <p className="text-2xl sm:text-3xl text-blue-600 font-bold mt-4 wrap-break-word">
            {product.price}
          </p>

          <p className="text-yellow-500 text-xl sm:text-2xl mt-4">
            {"★".repeat(product.rating)}
            {"☆".repeat(5 - product.rating)}
          </p>

          <p className="mt-6 text-gray-600 leading-8">
            This is a high-quality {product.name} designed for excellent
            performance, reliability, and everyday productivity.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8">
            {/* Quantity Selector */}
            <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-12 h-14 text-xl font-bold hover:bg-gray-100 transition"
              >
                −
              </button>

              <span className="w-12 text-center font-semibold text-lg">
                {quantity}
              </span>

              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-12 h-14 text-xl font-bold hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => addToCart(product, quantity)}
              type="button"
              className="flex-1 min-w-40 bg-blue-600 text-white px-4 py-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-semibold"
            >
              <FaShoppingCart />
              Add to Cart
            </button>

            {/* Wishlist */}
            <button
              aria-label={
                isWishlisted
                  ? `Remove ${product.name} from wishlist`
                  : `Add ${product.name} to wishlist`
              }
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`w-14 h-14 shrink-0 border-2 border-blue-600 rounded-lg transition flex items-center justify-center ${
                isWishlisted
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 hover:bg-blue-600 hover:text-white"
              }`}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FaHeart />
            </button>
          </div>
          {/* Product Tabs */}
          <div className="mt-10 border-b flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-3 font-semibold transition whitespace-nowrap ${
                activeTab === "description"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Description
            </button>

            <button
              onClick={() => setActiveTab("specifications")}
              className={`pb-3 font-semibold transition whitespace-nowrap ${
                activeTab === "specifications"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Specifications
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 font-semibold transition whitespace-nowrap ${
                activeTab === "reviews"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Reviews
            </button>
          </div>
          <div className="mt-8">
            {activeTab === "description" && (
              <div>
                <p className="text-gray-600 leading-8">
                  The {product.name} is designed to deliver exceptional
                  performance, reliability and speed for work, gaming and
                  everyday computing. Built with premium materials and modern
                  hardware, it offers a smooth user experience for
                  professionals, students and enthusiasts alike.
                </p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="space-y-3">
                <p>
                  <strong>Brand:</strong> {product.brand}
                </p>

                <p>
                  <strong>Category:</strong> {product.category}
                </p>

                <p>
                  <strong>Type:</strong> {product.type}
                </p>

                <p>
                  <strong>Rating:</strong> {product.rating} / 5
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <p className="font-semibold">⭐⭐⭐⭐⭐ David</p>
                  <p className="text-gray-600 mt-2">
                    Excellent performance. Highly recommended.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="font-semibold">⭐⭐⭐⭐ Sarah</p>
                  <p className="text-gray-600 mt-2">
                    Very good product with impressive battery life.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="font-semibold">⭐⭐⭐⭐⭐ Michael</p>
                  <p className="text-gray-600 mt-2">
                    Worth every naira. Great quality and fast performance.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Product Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-10 sm:mt-12">
          <div className="bg-white rounded-2xl p-4 sm:p-6 flex items-start gap-5 shadow-md hover:shadow-xl transition-all duration-300">
            <FaTruck className="text-4xl text-blue-600 shrink-0 mt-1" />

            <div>
              <h3 className="text-xl font-bold text-gray-900">Fast Delivery</h3>

              <p className="text-gray-600 mt-2">
                Delivery available within 2–5 business days nationwide.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 flex items-start gap-5 shadow-md hover:shadow-xl transition-all duration-300">
            <FaShieldAlt className="text-4xl text-blue-600 shrink-0 mt-1" />

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Secure Payment
              </h3>

              <p className="text-gray-600 mt-2">
                Shop confidently with secure payment methods.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 flex items-start gap-5 shadow-md hover:shadow-xl transition-all duration-300">
            <FaUndo className="text-4xl text-blue-600 shrink-0 mt-1" />

            <div>
              <h3 className="text-xl font-bold text-gray-900">Easy Returns</h3>

              <p className="text-gray-600 mt-2">
                Eligible products can be returned within 7 days.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 flex items-start gap-5 shadow-md hover:shadow-xl transition-all duration-300">
            <FaAward className="text-4xl text-blue-600 shrink-0 mt-1" />

            <div>
              <h3 className="text-xl font-bold text-gray-900">Warranty</h3>

              <p className="text-gray-600 mt-2">
                Manufacturer warranty available on selected products.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Recommendations */}

      <div className="mt-12 sm:mt-16 lg:mt-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          You May Also Like
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              image={item.image}
              name={item.name}
              price={item.price}
              rating={item.rating}
              badge={item.badge}
              reason={item.reason}
              brand={item.brand}
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      </div>
      <RecentlyViewed
        products={recentlyViewed}
        addToCart={addToCart}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
      />
    </section>
  );
}

export default ProductDetails;
