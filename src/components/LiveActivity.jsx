import { useEffect, useState } from "react";
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
  times,
  activityTypes,
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

function LiveActivity() {
  const [products, setProducts] = useState([]);
  const [activity, setActivity] = useState(null);
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

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

      const customer =
        customerNames[Math.floor(Math.random() * customerNames.length)];

      const city = cities[Math.floor(Math.random() * cities.length)];

      const product = products[Math.floor(Math.random() * products.length)];

      const time = times[Math.floor(Math.random() * times.length)];

      const type =
        activityTypes[Math.floor(Math.random() * activityTypes.length)];

      const viewers = Math.floor(Math.random() * 20) + 5;

      setActivity({
        customer,
        city,
        product,
        time,
        type,
        viewers,
      });

      setVisible(true);
      setFade(false);
      setShowNotification(true);

      clearTimeout(hideTimer);
      clearTimeout(removeTimer);

      hideTimer = setTimeout(() => {
        setFade(true);

        removeTimer = setTimeout(() => {
          setShowNotification(false);
        }, 500);
      }, 5000);
    };

    generateActivity();

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

            {activity.type === "bestseller" && "Best Seller"}
          </p>

          <p className="text-gray-600 text-sm">
            {activity.type === "purchase" && "purchased"}

            {activity.type === "wishlist" && "added to wishlist"}

            {activity.type === "view" && "are viewing this item"}

            {activity.type === "trending" && "is trending today"}

            {activity.type === "bestseller" && "is one of our best sellers"}
          </p>
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
