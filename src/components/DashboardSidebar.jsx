import {
  FaTachometerAlt,
  FaShoppingBag,
  FaHeart,
  FaHistory,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../context/useAuth";

function DashboardSidebar() {
  const { logout } = useAuth();
  const menuItems = [
    {
      icon: <FaTachometerAlt />,
      title: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <FaShoppingBag />,
      title: "Orders",
      path: "/orders",
    },
    {
      icon: <FaHeart />,
      title: "Wishlist",
      path: "/wishlist",
    },
    {
      icon: <FaHistory />,
      title: "Recently Viewed",
      path: "/recently-viewed",
    },
    {
      icon: <FaUser />,
      title: "Profile",
      path: "/profile",
    },
    {
      icon: <FaCog />,
      title: "Settings",
      path: "/settings",
    },
  ];
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (!confirmLogout) return;

    const result = await logout();

    if (!result.success) {
      console.error("Logout failed:", result.message);
      return;
    }

    window.location.href = "/";
  };

  return (
    <aside className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 h-fit">
      <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-5 lg:mb-8">
        My Account
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 sm:gap-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center gap-2 sm:gap-3 lg:gap-4 px-3 sm:px-4 lg:px-5 py-3 lg:py-4 rounded-xl transition-all duration-300 min-w-0 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-600 hover:text-white"
              }`
            }
          >
            <span className="text-base sm:text-lg shrink-0">{item.icon}</span>

            <span className="font-medium text-sm sm:text-base wrap-break-word">
              {item.title}
            </span>
          </NavLink>
        ))}
      </div>

      <Link
        to="/products"
        className="block w-full bg-green-600 hover:bg-green-700 text-white text-center mt-5 sm:mt-6 py-3 px-4 rounded-xl transition font-semibold"
      >
        Continue Shopping
      </Link>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 sm:mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition font-semibold"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
}

export default DashboardSidebar;
