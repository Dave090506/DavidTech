import { useState } from "react";
import { toast } from "react-toastify";

import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      toast.error("Please complete all fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    toast.success("Message submitted successfully!");

    setFormData({
      fullName: "",
      email: "",
      subject: "",
      message: "",
    });
  };
  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <h1 className="text-5xl font-extrabold text-center mb-6">
        <span className="text-blue-600">Contact</span>{" "}
        <span className="text-gray-900">DavidTech</span>
      </h1>

      <p className="text-center text-gray-600 mb-12">
        We'd love to hear from you. Send us a message and we'll get back to you
        as soon as possible.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">
            Get In Touch
          </h2>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaMapMarkerAlt className="text-blue-600" />
                <h3 className="font-semibold text-lg">Address</h3>
              </div>
              <p className="text-gray-600">
                Okpanam Road, Asaba, Delta State, Nigeria
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaPhoneAlt className="text-blue-600" />
                <h3 className="font-semibold text-lg">Phone</h3>
              </div>
              <p className="text-gray-600">+234 810 832 7029</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaEnvelope className="text-blue-600" />
                <h3 className="font-semibold text-lg">Email</h3>
              </div>
              <p className="text-gray-600">chinedumdavid2020@gmail.com</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaClock className="text-blue-600" />
                <h3 className="font-semibold text-lg">Business Hours</h3>
              </div>
              <p className="text-gray-600">
                Monday - Friday: 8:00 AM - 6:00 PM
              </p>
              <p className="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
              <p className="text-gray-600">Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">
            Send a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />

            <textarea
              rows="6"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
