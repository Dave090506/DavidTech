import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from "../context/useAuth";
import DashboardSidebar from "../components/DashboardSidebar";

function EditProfile() {
  const navigate = useNavigate();

  const { user, updateProfile } = useAuth();

  const [profile, setProfile] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!profile.fullName || !profile.email) {
      toast.error("Name and email are required.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(profile.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const result = await updateProfile(profile);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    navigate("/profile");
  };

  return (
    <section className="min-h-screen bg-gray-100 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          <DashboardSidebar />

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Edit Profile
              </h1>

              <p className="text-gray-500 mb-6 sm:mb-8">
                Update your personal information
              </p>

              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label
                    htmlFor="profile-full-name"
                    className="block font-semibold mb-2"
                  >
                    Full Name
                  </label>

                  <input
                    id="profile-full-name"
                    type="text"
                    name="fullName"
                    autoComplete="name"
                    required
                    value={profile.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-email"
                    className="block font-semibold mb-2"
                  >
                    Email Address
                  </label>

                  <input
                    id="profile-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={profile.email}
                    readOnly
                    className="w-full border border-gray-300 rounded-xl p-3 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Your account email cannot be changed from this page.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="profile-phone"
                    className="block font-semibold mb-2"
                  >
                    Phone Number
                  </label>

                  <input
                    id="profile-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-address"
                    className="block font-semibold mb-2"
                  >
                    Address
                  </label>

                  <textarea
                    id="profile-address"
                    name="address"
                    autoComplete="street-address"
                    value={profile.address}
                    onChange={handleChange}
                    placeholder="Address"
                    rows="4"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl transition font-semibold"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 px-7 py-3 rounded-xl transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EditProfile;
