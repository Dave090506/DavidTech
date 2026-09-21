import {
  FaMicrophone,
  FaLightbulb,
  FaShoppingCart,
  FaLaptop,
} from "react-icons/fa";
function About() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <h1 className="text-5xl font-bold text-center text-blue-600 mb-10">
        About DavidTech
      </h1>

      <p className="text-lg text-gray-700 leading-8 text-center max-w-4xl mx-auto">
        DavidTech is a modern computer gadget e-commerce platform created to
        provide customers with quality laptops, desktop computers, monitors,
        keyboards, mice, and accessories at competitive prices.
      </p>

      <div className="grid md:grid-cols-2 gap-12 mt-16">
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4 text-blue-600">Our Mission</h2>

          <p className="text-gray-600 leading-8">
            To make technology easily accessible by providing reliable computer
            products with a seamless shopping experience powered by intelligent
            recommendations and voice-based search.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4 text-blue-600">Our Vision</h2>

          <p className="text-gray-600 leading-8">
            To become one of the leading online computer stores by delivering
            innovation, quality products, and exceptional customer satisfaction.
          </p>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          What DavidTech Offers
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white shadow-lg rounded-2xl p-7 text-center">
            <FaLaptop className="text-4xl text-blue-600 mx-auto mb-5" />

            <h3 className="text-xl font-bold mb-3">Computer Gadgets</h3>

            <p className="text-gray-600">
              Browse laptops, desktops, monitors and computer accessories from
              different brands.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-7 text-center">
            <FaMicrophone className="text-4xl text-blue-600 mx-auto mb-5" />

            <h3 className="text-xl font-bold mb-3">Voice Search</h3>

            <p className="text-gray-600">
              Find products conveniently using spoken search commands as an
              alternative to typing.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-7 text-center">
            <FaLightbulb className="text-4xl text-blue-600 mx-auto mb-5" />

            <h3 className="text-xl font-bold mb-3">Recommendations</h3>

            <p className="text-gray-600">
              Discover related products based on product category, brand and
              type.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-7 text-center">
            <FaShoppingCart className="text-4xl text-blue-600 mx-auto mb-5" />

            <h3 className="text-xl font-bold mb-3">Easy Shopping</h3>

            <p className="text-gray-600">
              Add products to your cart or wishlist and complete your order
              through a simple checkout process.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mt-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Why Choose DavidTech?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-xl p-8 text-center hover:shadow-2xl transition">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">
              Quality Products
            </h3>

            <p className="text-gray-600 leading-7">
              We provide carefully selected laptops, desktops and accessories
              from trusted brands to ensure reliability and performance.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-8 text-center hover:shadow-2xl transition">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">
              Personalized Shopping
            </h3>

            <p className="text-gray-600 leading-7">
              Our recommendation system helps customers discover related
              products based on characteristics such as product category, brand
              and type.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-8 text-center hover:shadow-2xl transition">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">
              Excellent Support
            </h3>

            <p className="text-gray-600 leading-7">
              We are committed to providing fast customer support and a seamless
              online shopping experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
