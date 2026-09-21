import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import useAuth from "../context/useAuth";
import DashboardSidebar from "../components/DashboardSidebar";

function Profile() {
  const { user } = useAuth();

  return (
    <section className="min-h-screen bg-gray-100 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          <DashboardSidebar />

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8 sm:mb-10">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold">My Profile</h1>

                  <p className="text-gray-500 mt-2">
                    View and manage your personal information
                  </p>
                </div>

                <Link
                  to="/edit-profile"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition font-semibold"
                >
                  <FaEdit />
                  Edit Profile
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.fullName || "User",
                  )}&background=2563eb&color=fff&size=128`}
                  alt="Profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shrink-0"
                />

                <div className="min-w-0 text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold wrap-break-word">
                    {user?.fullName || "User"}
                  </h2>

                  <p className="text-gray-500 wrap-break-word">{user?.email}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 min-w-0">
                  <p className="text-gray-500 flex items-center gap-2 mb-2">
                    <FaUser className="text-blue-600" />
                    Full Name
                  </p>

                  <p className="font-semibold wrap-break-word">
                    {user?.fullName || "Not provided"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 min-w-0">
                  <p className="text-gray-500 flex items-center gap-2 mb-2">
                    <FaEnvelope className="text-blue-600" />
                    Email
                  </p>

                  <p className="font-semibold wrap-break-word">
                    {user?.email || "Not provided"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 min-w-0">
                  <p className="text-gray-500 flex items-center gap-2 mb-2">
                    <FaPhone className="text-blue-600" />
                    Phone
                  </p>

                  <p className="font-semibold wrap-break-word">
                    {user?.phone || "Not provided"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 min-w-0">
                  <p className="text-gray-500 flex items-center gap-2 mb-2">
                    <FaMapMarkerAlt className="text-blue-600" />
                    Address
                  </p>

                  <p className="font-semibold wrap-break-word">
                    {user?.address || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
