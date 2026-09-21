import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaUser,
  FaHeart,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import useAuth from "../context/useAuth";
import logo from "../assets/images/TechLogo.png";
function Navbar({ cart, wishlist }) {
  const { isLoggedIn } = useAuth();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalWishlistItems = wishlist.length;
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center transition duration-300 hover:scale-105"
        >
          <img
            src={logo}
            alt="DavidTech Logo"
            className="h-12 sm:h-14 lg:h-16 w-auto object-contain"
          />
        </Link>
        {/* Navigation Links */}
        {/* Navigation + Actions */}
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-button lg:hidden flex items-center justify-center w-11 h-11 rounded-lg text-2xl text-gray-700 hover:bg-gray-100 transition"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="hidden lg:flex items-center gap-10">
          {/* Navigation Links */}
          <ul className="flex items-center gap-10 text-[17px] font-medium">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `transition-colors duration-300 ${
                    isActive
                      ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                      : "text-gray-700 hover:text-blue-600"
                  }`
                }
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `transition-colors duration-300 ${
                    isActive
                      ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                      : "text-gray-700 hover:text-blue-600"
                  }`
                }
              >
                Products
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `transition-colors duration-300 ${
                    isActive
                      ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                      : "text-gray-700 hover:text-blue-600"
                  }`
                }
              >
                About
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `transition-colors duration-300 ${
                    isActive
                      ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                      : "text-gray-700 hover:text-blue-600"
                  }`
                }
              >
                Contact
              </NavLink>
            </li>
          </ul>
          <Link
            to="/wishlist"
            className="dark-nav-wishlist relative w-12 h-12 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center text-gray-700 hover:text-red-500 transition-all duration-300"
          >
            <FaHeart />

            {totalWishlistItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] min-w-5.5 h-5.5 px-1 rounded-full flex items-center justify-center font-bold shadow">
                {totalWishlistItems}
              </span>
            )}
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Link
                to="/cart"
                className="dark-nav-cart relative w-12 h-12 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-gray-700 hover:text-blue-600 transition-all duration-300"
              >
                <FaShoppingCart />
              </Link>

              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] min-w-5.5 h-5.5 px-1 rounded-full flex items-center justify-center font-bold shadow">
                  {totalItems}
                </span>
              )}
            </div>

            {/* before it was to="/login"*/}
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="dark-nav-account inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FaUser className="text-sm" />
                <span>My Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FaUser className="text-sm" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mobile-menu-panel lg:hidden bg-white shadow-lg border-t border-gray-200"
          >
            <div className="mobile-menu-links flex flex-col p-6 gap-4">
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className="mobile-nav-link text-lg font-medium hover:text-blue-600"
              >
                Home
              </NavLink>

              <NavLink
                to="/products"
                onClick={() => setMenuOpen(false)}
                className="mobile-nav-link text-lg font-medium hover:text-blue-600"
              >
                Products
              </NavLink>

              <NavLink
                to="/about"
                onClick={() => setMenuOpen(false)}
                className="mobile-nav-link text-lg font-medium hover:text-blue-600"
              >
                About
              </NavLink>

              <NavLink
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="mobile-nav-link text-lg font-medium hover:text-blue-600"
              >
                Contact
              </NavLink>

              <NavLink
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="mobile-nav-link mobile-wishlist-link text-lg font-medium hover:text-red-500"
              >
                ❤️ Wishlist ({totalWishlistItems})
              </NavLink>

              <NavLink
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="mobile-nav-link mobile-cart-link text-lg font-medium hover:text-blue-600"
              >
                🛒 Cart ({totalItems})
              </NavLink>

              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="bg-blue-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition"
                >
                  My Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="bg-blue-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
