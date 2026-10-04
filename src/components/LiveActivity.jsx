import { useEffect, useRef, useState } from "react";
import {
  FaShoppingCart,
  FaTimes,
  FaEye,
  FaHeart,
  FaFire,
  FaStar,
} from "react-icons/fa";

import localProducts from "../data/products";
import { supabase } from "../services/supabaseClient";
import {
  customerNames,
  cities,
  activityTypes,
  activityMessages,
} from "../data/liveActivity";

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

const getRandomItem = (items) =>
  items[Math.floor(Math.random() * items.length)];

const getSimulatedTime = () => {
  const minutes = Math.floor(Math.random() * 10);

  if (minutes === 0) return "Just now";
  if (minutes === 1) return "1 minute ago";

  return `${minutes} minutes ago`;
};

function LiveActivity() {
  const [products, setProducts] = useState([]);
  const [activity, setActivity] = useState(null);
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const lastActivityRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error loading live activity products:", error);
        return;
      }

      const formattedProducts = (data || []).map((product) => ({
        ...product,
        image: getProductImage(product),
      }));

      setProducts(formattedProducts);
    };

    loadProducts();
  }, []);

  useEffect(() => {
    let hideTimer;
    let removeTimer;

    const generateActivity = () => {
      if (products.length === 0) return;

      const previousActivity = lastActivityRef.current;

      let type = getRandomItem(activityTypes);

      // Prevent the same activity type from appearing twice in a row
      if (activityTypes.length > 1 && type === previousActivity?.type) {
        const otherTypes = activityTypes.filter(
          (item) => item !== previousActivity.type,
        );

        type = getRandomItem(otherTypes);
      }

      let productPool = products;

      // Best seller notifications favour highly rated products
      if (type === "bestseller") {
        const highlyRatedProducts = products.filter(
          (product) => Number(product.rating || 0) >= 4.5,
        );

        if (highlyRatedProducts.length > 0) {
          productPool = highlyRatedProducts;
        }
      }

      // Trending notifications favour well-rated products
      if (type === "trending") {
        const trendingProducts = products.filter(
          (product) => Number(product.rating || 0) >= 4.0,
        );

        if (trendingProducts.length > 0) {
          productPool = trendingProducts;
        }
      }

      // Prevent the same product from appearing twice in a row
      const differentProducts = productPool.filter(
        (product) => String(product.id) !== String(previousActivity?.productId),
      );

      if (differentProducts.length > 0) {
        productPool = differentProducts;
      }

      const product = getRandomItem(productPool);

      const newActivity = {
        customer: getRandomItem(customerNames),
        city: getRandomItem(cities),
        product,
        type,
        message: getRandomItem(activityMessages[type]),
        time: getSimulatedTime(),
        viewers: type === "view" ? Math.floor(Math.random() * 16) + 5 : null,
      };

      setActivity(newActivity);

      // Remember the previous notification without causing a re-render
      lastActivityRef.current = {
        type,
        productId: product.id,
      };

      setVisible(true);
      setFade(false);
      setShowNotification(true);

      clearTimeout(hideTimer);
      clearTimeout(removeTimer);

      // Start fading after 5 seconds
      hideTimer = setTimeout(() => {
        setFade(true);

        // Remove after fade animation
        removeTimer = setTimeout(() => {
          setShowNotification(false);
        }, 500);
      }, 5000);
    };

    // Show the first notification
    generateActivity();

    // Generate another notification every 15 seconds
    const interval = setInterval(generateActivity, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [products]);
  const handleClose = () => {
    setFade(true);

    setTimeout(() => {
      setVisible(false);
      setShowNotification(false);
    }, 500);
  };

  if (!activity || !visible || !showNotification) return null;
  const activityIcon = {
    purchase: <FaShoppingCart className="text-green-500" />,
    view: <FaEye className="text-blue-500" />,
    wishlist: <FaHeart className="text-pink-500" />,
    trending: <FaFire className="text-orange-500" />,
    bestseller: <FaStar className="text-yellow-500" />,
  };

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 z-50 bg-white shadow-2xl rounded-2xl p-5 sm:w-80 border border-gray-200 transition-all duration-500 ${
        fade ? "opacity-0 -translate-x-8" : "opacity-100 translate-x-0"
      }`}
    >
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
      >
        <FaTimes />
      </button>
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 p-3 rounded-full text-xl">
          {activityIcon[activity.type]}
        </div>

        <div>
          <p className="font-semibold">
            {activity.type === "purchase" &&
              `${activity.customer} from ${activity.city}`}

            {activity.type === "wishlist" &&
              `${activity.customer} from ${activity.city}`}

            {activity.type === "view" && `${activity.viewers} customers`}

            {activity.type === "trending" && "Trending Product"}

            {activity.type === "bestseller" && "Popular Product"}
          </p>

          <p className="text-gray-600 text-sm">{activity.message}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-3 items-center">
        <img
          src={activity.product.image}
          alt={activity.product.name}
          className="w-16 h-16 object-contain rounded-lg bg-gray-100 p-1"
        />

        <div>
          <p className="font-semibold text-sm">{activity.product.name}</p>

          <p className="text-blue-600 font-bold">{activity.product.price}</p>

          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-3 text-right">
        Simulated activity
      </p>
    </div>
  );
}

export default LiveActivity;
