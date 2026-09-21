import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaEnvelope, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import useAdmin from "../context/useAdmin";

function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin, isAdminLoggedIn } = useAdmin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter your email and password.");
      return;
    }

    const result = await adminLogin(formData.email.trim(), formData.password);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    navigate("/admin");
  };

  if (isAdminLoggedIn) {
    return (
      <section className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full">
          <FaUserShield className="text-6xl text-blue-600 mx-auto" />

          <h1 className="text-2xl font-bold mt-5">
            Administrator Already Logged In
          </h1>

          <p className="text-gray-500 mt-3">
            You already have an active administrator session.
          </p>

          <button
            onClick={() => navigate("/admin")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
          >
            Go to Admin Dashboard
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <FaUserShield className="text-4xl text-blue-600" />
            </div>

            <h1 className="text-3xl font-bold mt-5">Admin Login</h1>

            <p className="text-gray-500 mt-2">Sign in to manage DavidTech.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
            <div>
              <label className="block font-semibold mb-2">Admin Email</label>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter admin email"
                  className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Password</label>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter admin password"
                  className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Login as Administrator
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full mt-4 text-gray-500 hover:text-blue-600 transition"
          >
            ← Return to Store
          </button>
        </div>
      </div>
    </section>
  );
}

export default AdminLogin;
