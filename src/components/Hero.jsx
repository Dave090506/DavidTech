import {
  FaLaptop,
  FaMicrophone,
  FaLightbulb,
  FaShoppingCart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import heroImage from "../assets/images/hero.png";
function Hero() {
  return (
    <section className="hero-section bg-linear-to-br from-slate-50 via-blue-50 to-white py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-16 min-h-[60vh] lg:min-h-[70vh]">
        {/* Left Side */}
        <div className="w-full md:w-1/2 max-w-xl text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
            Build Your
            <span className="text-blue-600"> Perfect Computer Setup</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-600 leading-7 sm:leading-8 max-w-xl mx-auto md:mx-0">
            Explore high-performance laptops, desktops, gaming accessories,
            computer hardware and more at affordable prices.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 sm:px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 text-center"
            >
              Shop Now
            </Link>

            <Link
              to="/products"
              className="border-2 border-blue-600 text-blue-600 px-6 sm:px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 text-center"
            >
              Explore Products
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-10 sm:mt-14">
            <div className="hero-feature-card bg-white rounded-2xl shadow-md p-4 sm:p-5 text-center hover:shadow-xl transition min-w-0">
              <FaLaptop className="text-blue-600 text-2xl sm:text-3xl mx-auto mb-3" />
              <h3 className="text-sm sm:text-base font-bold">
                Computer Gadgets
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Quality products
              </p>
            </div>

            <div className="hero-feature-card bg-white rounded-2xl shadow-md p-4 sm:p-5 text-center hover:shadow-xl transition min-w-0">
              <FaMicrophone className="text-blue-600 text-2xl sm:text-3xl mx-auto mb-3" />
              <h3 className="text-sm sm:text-base font-bold">Voice Search</h3>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Search by voice
              </p>
            </div>

            <div className="hero-feature-card bg-white rounded-2xl shadow-md p-4 sm:p-5 text-center hover:shadow-xl transition min-w-0">
              <FaLightbulb className="text-blue-600 text-2xl sm:text-3xl mx-auto mb-3" />
              <h3 className="text-xs sm:text-sm lg:text-base font-bold leading-tight wrap-break-word">
                Recommendations
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Relevant products
              </p>
            </div>

            <div className="hero-feature-card bg-white rounded-2xl shadow-md p-4 sm:p-5 text-center hover:shadow-xl transition min-w-0">
              <FaShoppingCart className="text-blue-600 text-2xl sm:text-3xl mx-auto mb-3" />
              <h3 className="text-sm sm:text-base font-bold">Easy Shopping</h3>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Simple checkout
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex md:w-1/2 justify-center">
          <img
            src={heroImage}
            alt="Gaming Laptop"
            className="w-full max-w-lg rounded-2xl shadow-2xl animate-float hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
