import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company */}
          <div>
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-500">David</span>
              <span className="text-white">Tech</span>
            </h2>

            <p className="leading-7 text-gray-400">
              Your trusted destination for laptops, desktop computers,
              accessories and premium computer gadgets at affordable prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/products" className="hover:text-blue-400 transition">
                  Products
                </Link>
              </li>

              <li>
                <Link to="/about" className="hover:text-blue-400 transition">
                  About
                </Link>
              </li>

              <li>
                <Link to="/contact" className="hover:text-blue-400 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-5">
              Categories
            </h3>

            <ul className="space-y-3">
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/products"
                    className="hover:text-blue-400 transition"
                  >
                    Laptops
                  </Link>
                </li>

                <li>
                  <Link
                    to="/products"
                    className="hover:text-blue-400 transition"
                  >
                    Desktop Computers
                  </Link>
                </li>

                <li>
                  <Link
                    to="/products"
                    className="hover:text-blue-400 transition"
                  >
                    Monitors
                  </Link>
                </li>

                <li>
                  <Link
                    to="/products"
                    className="hover:text-blue-400 transition"
                  >
                    Accessories
                  </Link>
                </li>

                <li>
                  <Link
                    to="/products"
                    className="hover:text-blue-400 transition"
                  >
                    Gaming
                  </Link>
                </li>
              </ul>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-5">
              Contact Us
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3 items-center">
                <FaPhoneAlt className="text-blue-500" />
                <span>+234 810 832 7029</span>
              </div>

              <div className="flex gap-3 items-center">
                <FaEnvelope className="text-blue-500" />
                <span>chinedumdavid2020@gmail.com</span>
              </div>

              <div className="flex gap-3 items-center">
                <FaMapMarkerAlt className="text-blue-500" />
                <span>Okpanam Road, Asaba, Delta State, Nigeria</span>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <div className="bg-gray-800 p-3 rounded-full">
                <FaFacebookF />
              </div>

              <div className="bg-gray-800 p-3 rounded-full">
                <FaTwitter />
              </div>

              <div className="bg-gray-800 p-3 rounded-ful">
                <FaInstagram />
              </div>

              <div className="bg-gray-800 p-3 rounded-full">
                <FaLinkedinIn />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-14 pt-8 text-center text-gray-500">
          © 2026 DavidTech. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
