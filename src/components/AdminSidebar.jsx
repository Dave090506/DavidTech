import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import useAdmin from "../context/useAdmin";

function AdminSidebar() {
  const { adminLogout } = useAdmin();
  const menuItems = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/admin",
    },
    {
      title: "Products",
      icon: <FaBoxOpen />,
      path: "/admin/products",
    },
    {
      title: "Orders",
      icon: <FaShoppingCart />,
      path: "/admin/orders",
    },
    {
      title: "Customers",
      icon: <FaUsers />,
      path: "/admin/customers",
    },
    {
      title: "Analytics",
      icon: <FaChartLine />,
      path: "/admin/analytics",
    },
    {
      title: "Settings",
      icon: <FaCog />,
      path: "/admin/settings",
    },
  ];
  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to log out of the admin panel?",
    );

    if (!confirmLogout) return;

    const result = await adminLogout();

    if (!result.success) {
      console.error("Admin logout failed:", result.message);
      return;
    }

    window.location.href = "/admin/login";
  };

  return (
    <aside className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 h-fit">
      <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-5 lg:mb-8">
        Admin Panel
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 sm:gap-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 sm:gap-3 lg:gap-4 px-3 sm:px-4 lg:px-5 py-3 lg:py-4 rounded-xl transition min-w-0 ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-blue-50"
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>

            <span className="text-sm sm:text-base font-medium wrap-break-word">
              {item.title}
            </span>
          </NavLink>
        ))}
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 sm:mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-3 transition font-medium"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;
