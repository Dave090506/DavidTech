import { useEffect, useState } from "react";
import { FaMoon, FaBell, FaLock, FaGlobe, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";

import useAuth from "../context/useAuth";
import DashboardSidebar from "../components/DashboardSidebar";

function Settings() {
  const { user, changePassword } = useAuth();

  const settingsKey = user?.id ? `settings_${user.id}` : null;

  const oldSettingsKey = user?.email ? `settings_${user.email}` : null;
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem(settingsKey);

    if (savedSettings) {
      return JSON.parse(savedSettings);
    }

    if (oldSettingsKey) {
      const oldSettings = localStorage.getItem(oldSettingsKey);

      if (oldSettings) {
        const parsedSettings = JSON.parse(oldSettings);

        localStorage.setItem(settingsKey, JSON.stringify(parsedSettings));

        return parsedSettings;
      }
    }

    return {
      notifications: true,
      darkMode: false,
      language: "English",
    };
  });

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("customer-dark");
    } else {
      document.documentElement.classList.remove("customer-dark");
    }
  }, [settings.darkMode]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleCheckbox = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.checked,
    });
  };

  const handleInput = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveSettings = () => {
    if (!settingsKey) {
      toast.error("Unable to save settings.");
      return;
    }

    localStorage.setItem(settingsKey, JSON.stringify(settings));

    toast.success("Settings saved successfully!");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please complete all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    const result = await changePassword(currentPassword, newPassword);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <section className="min-h-screen bg-gray-100 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          <DashboardSidebar />

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Account Settings
              </h1>

              <p className="text-gray-500 mb-6 sm:mb-8">
                Manage your account preferences and security.
              </p>

              <div className="space-y-6 sm:space-y-8">
                {/* Notifications */}
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
                  <div className="flex items-start gap-3 min-w-0">
                    <FaBell className="text-blue-600 text-xl shrink-0 mt-1" />

                    <div>
                      <h3 className="font-semibold">Order Notifications</h3>

                      <p className="text-gray-500 text-sm">
                        Save your preference for order and store notifications.
                      </p>
                    </div>
                  </div>

                  <input
                    id="settings-notifications"
                    type="checkbox"
                    name="notifications"
                    checked={settings.notifications}
                    onChange={handleCheckbox}
                    className="w-5 h-5 shrink-0 mt-1 cursor-pointer"
                    aria-label="Enable email notifications"
                  />
                </div>

                {/* Dark Mode */}
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
                  <div className="flex items-start gap-3 min-w-0">
                    <FaMoon className="text-blue-600 text-xl shrink-0 mt-1" />

                    <div>
                      <h3 className="font-semibold">Dark Mode</h3>

                      <p className="text-gray-500 text-sm">
                        Save your preferred appearance setting.
                      </p>
                    </div>
                  </div>

                  <input
                    id="settings-dark-mode"
                    type="checkbox"
                    name="darkMode"
                    checked={settings.darkMode}
                    onChange={handleCheckbox}
                    className="w-5 h-5 shrink-0 mt-1 cursor-pointer"
                    aria-label="Prefer dark mode"
                  />
                </div>

                {/* Language */}
                <div>
                  <label
                    htmlFor="settings-language"
                    className="flex items-center gap-2 font-semibold mb-3"
                  >
                    <FaGlobe className="text-blue-600" />
                    Language
                  </label>

                  <select
                    id="settings-language"
                    name="language"
                    value={settings.language}
                    onChange={handleInput}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>English</option>
                    <option>French</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center justify-center gap-3 transition font-semibold"
                >
                  <FaSave />
                  Save Preferences
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8 mt-6 sm:mt-8">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3 mb-2">
                <FaLock className="text-blue-600" />
                Change Password
              </h2>

              <p className="text-gray-500 mb-6">
                Update the password used to access your account.
              </p>

              <form onSubmit={handleChangePassword} className="space-y-5">
                <div>
                  <label
                    htmlFor="current-password"
                    className="block font-semibold mb-2"
                  >
                    Current Password
                  </label>

                  <input
                    id="current-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-password"
                    className="block font-semibold mb-2"
                  >
                    New Password
                  </label>

                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-new-password"
                    className="block font-semibold mb-2"
                  >
                    Confirm New Password
                  </label>

                  <input
                    id="confirm-new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition font-semibold"
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Settings;
