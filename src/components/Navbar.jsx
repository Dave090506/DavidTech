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
                to="/build-setup"
                className={({ isActive }) =>
                  `transition-colors duration-300 ${
                    isActive
                      ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                      : "text-gray-700 hover:text-blue-600"
                  }`
                }
              >
                Build My Setup
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
      {/* Mobile Side Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dark background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 top-20 bg-black/40 z-40 lg:hidden"
            />

            {/* Side drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="fixed top-20 right-0 z-50 h-[calc(100vh-5rem)] w-[75%] max-w-75 bg-white shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col p-6 gap-2">
                <NavLink
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-base font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    }`
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  to="/products"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-base font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    }`
                  }
                >
                  Products
                </NavLink>

                <NavLink
                  to="/build-setup"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-base font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    }`
                  }
                >
                  Build My Setup
                </NavLink>

                <NavLink
                  to="/about"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-base font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    }`
                  }
                >
                  About
                </NavLink>

                <NavLink
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-base font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    }`
                  }
                >
                  Contact
                </NavLink>

                {/* Divider */}
                <div className="border-t border-gray-200 my-2" />

                <NavLink
                  to="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-red-50 hover:text-red-500 transition"
                >
                  <FaHeart className="text-red-500" />

                  <span>Wishlist</span>

                  {totalWishlistItems > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                      {totalWishlistItems}
                    </span>
                  )}
                </NavLink>

                <NavLink
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <FaShoppingCart className="text-blue-600" />

                  <span>Cart</span>

                  {totalItems > 0 && (
                    <span className="ml-auto bg-blue-600 text-white text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </NavLink>

                {/* Login / Dashboard */}
                <div className="mt-4">
                  {isLoggedIn ? (
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                      <FaUser />
                      My Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                      <FaUser />
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
