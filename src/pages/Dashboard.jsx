import {
  FaShoppingCart,
  FaHeart,
  FaEye,
  FaBoxOpen,
  FaHistory,
} from "react-icons/fa";
import DashboardSidebar from "../components/DashboardSidebar";
import { useEffect, useState } from "react";
import localProducts from "../data/products";
import { supabase } from "../services/supabaseClient";
import getRecommendations from "../utils/recommendations";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import { MdWavingHand } from "react-icons/md";
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

function Dashboard({ cart, wishlist, addToCart, toggleWishlist }) {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [totalOrders, setTotalOrders] = useState([]);
  const recentlyViewedKey = user?.id
    ? `recentlyViewed_${user.id}`
    : "recentlyViewed_guest";

  const recentlyViewed =
    JSON.parse(localStorage.getItem(recentlyViewedKey)) || [];
  const profile = {
    fullName: user?.fullName || "User",
    email: user?.email || "No email provided",
    phone: user?.phone || "",
    address: user?.address || "",
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (productsError) {
        console.error("Error loading dashboard products:", productsError);
      } else {
        const formattedProducts = (productsData || []).map((product) => ({
          ...product,
          image: getProductImage(product),
        }));

        setProducts(formattedProducts);
      }

      if (!user?.id) {
        setTotalOrders([]);
        return;
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("id, total, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Error loading dashboard orders:", ordersError);
        setTotalOrders([]);
        return;
      }

      const formattedOrders = (ordersData || []).map((order) => ({
        ...order,
        status: order.status
          ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
          : "Pending",
      }));

      setTotalOrders(formattedOrders);
    };

    loadDashboardData();
  }, [user?.id]);

  // Get the most recently viewed product
  const lastViewedProduct = recentlyViewed[0];

  // Generate recommendations based on it
  const recommendedProducts = lastViewedProduct
    ? getRecommendations(lastViewedProduct, products)
    : [];
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const stats = [
    {
      title: "Orders",
      value: totalOrders.length,
      icon: <FaBoxOpen />,
      color: "bg-blue-600",
    },
    {
      title: "Cart Items",
      value: totalCartItems,
      icon: <FaShoppingCart />,
      color: "bg-green-600",
    },
    {
      title: "Wishlist",
      value: wishlist.length,
      icon: <FaHeart />,
      color: "bg-red-500",
    },
    {
      title: "Recently Viewed",
      value: recentlyViewed.length,
      icon: <FaEye />,
      color: "bg-purple-600",
    },
  ];

  const activity = [
    {
      icon: <FaBoxOpen className="text-blue-600" />,
      title: totalOrders.length ? `Order ${totalOrders[0].status}` : "Orders",
      description: totalOrders.length
        ? `Order #${totalOrders[0].id} is currently ${totalOrders[0].status.toLowerCase()}.`
        : "No orders placed yet.",
      time: "Latest",
    },

    {
      icon: <FaEye className="text-purple-600" />,
      title: "Recently Viewed",
      description: recentlyViewed.length
        ? `Viewed ${recentlyViewed[0].name}`
        : "No products viewed yet.",
      time: "Recently",
    },

    {
      icon: <FaHeart className="text-red-500" />,
      title: "Wishlist",
      description: wishlist.length
        ? `${wishlist.length} item(s) saved.`
        : "Wishlist is currently empty.",
      time: "Now",
    },

    {
      icon: <FaShoppingCart className="text-green-600" />,
      title: "Shopping Cart",
      description: `${totalCartItems} item(s) currently in cart.`,
      time: "Live",
    },
  ];

  return (
    <section className="min-h-screen bg-gray-100 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          {/* Sidebar */}

          <DashboardSidebar />

          {/* Right Content */}

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profile.fullName,
                  )}&background=2563eb&color=fff&size=128`}
                  alt="Profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shrink-0"
                />

                <div>
                  <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold flex flex-wrap items-center gap-2 wrap-break-word">
                    Welcome Back, {profile.fullName}
                    <motion.div
                      animate={{ rotate: [0, 20, -10, 20, 0] }}
                      transition={{ duration: 1.2 }}
                    >
                      <MdWavingHand className="text-yellow-500 text-2xl sm:text-3xl xl:text-4xl" />
                    </motion.div>
                  </h1>

                  <p className="text-gray-500 mt-2 wrap-break-word">
                    {profile.email}
                  </p>

                  <p className="text-sm text-gray-400">
                    {profile.phone || "Phone number not added"}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm sm:hover:shadow-xl sm:hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`${stat.color} w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl shadow-md`}
                  >
                    {stat.icon}
                  </div>

                  <h3 className="mt-6 text-gray-500 text-sm uppercase tracking-wide">
                    {stat.title}
                  </h3>

                  <p className="text-3xl sm:text-4xl font-extrabold mt-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Updated just now</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 mt-6 sm:mt-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-6">
                Profile Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <p className="text-gray-500">Full Name</p>
                  <p className="font-semibold">{profile.fullName}</p>
                </div>

                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-semibold wrap-break-word">
                    {profile.email}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-semibold">
                    {profile.phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Address</p>
                  <p className="font-semibold wrap-break-word">
                    {profile.address}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8 mt-6 sm:mt-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                  <FaHistory className="text-blue-600" />
                  Recent Activity
                </h2>

                <span className="text-sm text-gray-500">
                  Latest account activity
                </span>
              </div>

              <div className="space-y-6">
                {activity.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 sm:gap-5 border-b border-gray-100 pb-5 last:border-none"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg sm:text-xl shrink-0">
                      {item.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{item.title}</h3>

                      <p className="text-gray-500 mt-1 wrap-break-word">
                        {item.description}
                      </p>
                    </div>

                    <span className="text-xs sm:text-sm text-gray-400 shrink-0">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 mt-6 sm:mt-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Recommended For You
                </h2>

                <span className="text-sm text-gray-500">
                  Based on your recent activity
                </span>
              </div>

              {recommendedProducts.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
                  {recommendedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                      badge={product.badge}
                      brand={product.brand}
                      reason={product.reason}
                      addToCart={addToCart}
                      wishlist={wishlist}
                      toggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    View some products to receive personalized recommendations.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
