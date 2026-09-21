import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import CartPage from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ScrollToTop from "./components/ScrollToTop";
import Wishlist from "./pages/Wishlist";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import RecentlyViewed from "./pages/RecentlyViewed";
import EditProfile from "./pages/EditProfile";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuth from "./context/useAuth";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import AdminCustomers from "./pages/AdminCustomers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSettings from "./pages/AdminSettings";
import { toast } from "react-toastify";

function App() {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      document.documentElement.classList.remove("customer-dark");
      return;
    }
    if (!user?.id) {
      document.documentElement.classList.remove("customer-dark");
      return;
    }

    const settingsKey = `settings_${user.id}`;
    const savedSettings = localStorage.getItem(settingsKey);

    if (!savedSettings) {
      document.documentElement.classList.remove("customer-dark");
      return;
    }

    try {
      const parsedSettings = JSON.parse(savedSettings);

      if (parsedSettings.darkMode) {
        document.documentElement.classList.add("customer-dark");
      } else {
        document.documentElement.classList.remove("customer-dark");
      }
    } catch {
      document.documentElement.classList.remove("customer-dark");
    }
  }, [user?.id, location.pathname]);
  const cartKey = user?.id ? `cart_${user.id}` : "cart_guest";

  const wishlistKey = user?.id ? `wishlist_${user.id}` : "wishlist_guest";

  const oldCartKey = user?.email ? `cart_${user.email}` : null;

  const oldWishlistKey = user?.email ? `wishlist_${user.email}` : null;
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const getSavedShoppingData = (newKey, oldKey = null) => {
    const savedData = localStorage.getItem(newKey);

    if (savedData) {
      return JSON.parse(savedData);
    }

    if (oldKey) {
      const oldData = localStorage.getItem(oldKey);

      if (oldData) {
        const parsedData = JSON.parse(oldData);

        localStorage.setItem(newKey, JSON.stringify(parsedData));

        return parsedData;
      }
    }

    return [];
  };

  const [cart, setCart] = useState(() =>
    getSavedShoppingData(cartKey, oldCartKey),
  );

  const [wishlist, setWishlist] = useState(() =>
    getSavedShoppingData(wishlistKey, oldWishlistKey),
  );

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, cartKey]);

  useEffect(() => {
    localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
  }, [wishlist, wishlistKey]);

  const addToCart = (product, quantity = 1) => {
    toast.success(`${product.name} added to cart!`);
    setCart((prevCart) => {
      // Check if product already exists
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (existingProduct) {
        // Increase quantity
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      // Add new product with quantity 1
      return [...prevCart, { ...product, quantity }];
    });
  };
  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };
  const toggleWishlist = (product) => {
    const exists = wishlist.find((item) => item.id === product.id);

    if (exists) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));

      toast.info(`${product.name} removed from wishlist`);
    } else {
      setWishlist([...wishlist, product]);

      toast.success(`${product.name} added to wishlist ❤️`);
    }
  };

  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Main Website */}
        <Route element={<MainLayout cart={cart} wishlist={wishlist} />}>
          <Route
            path="/"
            element={
              <Home
                search={search}
                setSearch={setSearch}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                addToCart={addToCart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            }
          />

          <Route
            path="/products"
            element={
              <Products
                addToCart={addToCart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            }
          />

          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<Contact />} />

          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                removeItem={removeItem}
              />
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout cart={cart} setCart={setCart} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/product/:id"
            element={
              <ProductDetails
                addToCart={addToCart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            }
          />

          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <Wishlist
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                addToCart={addToCart}
              />
            }
          />
        </Route>

        {/* Authentication */}
        <Route element={<AuthLayout cart={cart} wishlist={wishlist} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard
                cart={cart}
                wishlist={wishlist}
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recently-viewed"
          element={
            <ProtectedRoute>
              <RecentlyViewed />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <AdminRoute>
              <AdminCustomers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <AdminRoute>
              <AdminAnalytics />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
