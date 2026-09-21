import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCog, FaStore, FaEnvelope, FaPhone, FaTruck } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";
import { adminSupabase } from "../services/supabaseClient";

function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: "DavidTech",
    storeEmail: "support@davidtech.com",
    storePhone: "",
    shippingFee: 5000,
    orderNotifications: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const { data, error } = await adminSupabase
        .from("store_settings")
        .select(
          "store_name, store_email, store_phone, shipping_fee, order_notifications",
        )
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Error loading store settings:", error);
        toast.error("Unable to load store settings.");
        setLoading(false);
        return;
      }

      setSettings({
        storeName: data.store_name,
        storeEmail: data.store_email,
        storePhone: data.store_phone || "",
        shippingFee: Number(data.shipping_fee || 0),
        orderNotifications: data.order_notifications,
      });

      setLoading(false);
    };

    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!settings.storeName || !settings.storeEmail) {
      toast.error("Store name and email are required.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(settings.storeEmail)) {
      toast.error("Please enter a valid store email address.");
      return;
    }

    const shippingFee = Number(settings.shippingFee);

    if (Number.isNaN(shippingFee) || shippingFee < 0) {
      toast.error("Please enter a valid shipping fee.");
      return;
    }

    try {
      setSaving(true);

      const { error } = await adminSupabase
        .from("store_settings")
        .update({
          store_name: settings.storeName.trim(),
          store_email: settings.storeEmail.trim(),
          store_phone: settings.storePhone.trim(),
          shipping_fee: shippingFee,
          order_notifications: settings.orderNotifications,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1);

      if (error) {
        throw error;
      }

      toast.success("Admin settings saved successfully.");
    } catch (error) {
      console.error("Error saving admin settings:", error);
      toast.error(error.message || "Unable to save admin settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-500">Loading admin settings...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">
          <AdminSidebar />

          <div>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Settings</h1>

              <p className="text-gray-500 mt-2">
                Manage DavidTech store information and administrative
                preferences.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              {/* Store Information */}
              <div className="bg-white rounded-2xl shadow-md p-5 sm:p-7">
                <div className="flex items-center gap-3 mb-6">
                  <FaStore className="text-2xl text-blue-600" />

                  <h2 className="text-xl sm:text-2xl font-bold">
                    Store Information
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label
                      htmlFor="store-name"
                      className="block font-semibold mb-2"
                    >
                      Store Name
                    </label>

                    <input
                      id="store-name"
                      type="text"
                      name="storeName"
                      value={settings.storeName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="store-email"
                      className="block font-semibold mb-2"
                    >
                      Store Email
                    </label>

                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                      <input
                        id="store-email"
                        type="email"
                        name="storeEmail"
                        value={settings.storeEmail}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="store-phone"
                      className="block font-semibold mb-2"
                    >
                      Store Phone
                    </label>

                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                      <input
                        id="store-phone"
                        type="tel"
                        name="storePhone"
                        value={settings.storePhone}
                        onChange={handleChange}
                        placeholder="Enter store phone number"
                        className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="store-shipping-fee"
                      className="block font-semibold mb-2"
                    >
                      Shipping Fee (₦)
                    </label>

                    <div className="relative">
                      <FaTruck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                      <input
                        id="store-shipping-fee"
                        type="number"
                        name="shippingFee"
                        min="0"
                        value={settings.shippingFee}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Administrative Preferences */}
              <div className="bg-white rounded-2xl shadow-md p-5 sm:p-7">
                <div className="flex items-center gap-3 mb-6">
                  <FaCog className="text-2xl text-blue-600" />

                  <h2 className="text-xl sm:text-2xl font-bold">
                    Administrative Preferences
                  </h2>
                </div>

                <div className="flex items-start justify-between gap-4 border rounded-xl p-4 sm:p-5">
                  <div className="min-w-0">
                    <h3 className="font-semibold">Order Notifications</h3>

                    <p className="text-gray-500 text-sm mt-1">
                      Save the administrator's preference for new order
                      notifications.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="orderNotifications"
                    checked={settings.orderNotifications}
                    onChange={handleChange}
                    className="w-5 h-5 shrink-0 mt-1 cursor-pointer"
                    aria-label="Enable administrator order notifications"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className={`w-full sm:w-auto text-white px-8 py-3 rounded-xl font-semibold transition ${
                  saving
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminSettings;
