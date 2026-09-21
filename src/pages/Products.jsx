import { useState } from "react";

import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";

function Products({ addToCart, wishlist, toggleWishlist }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");

  return (
    <section className="py-8 sm:py-10">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
          <span className="text-blue-600">Our</span>{" "}
          <span className="text-gray-900">Products</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
          Browse our collection of laptops, desktop computers, monitors,
          keyboards, mice and premium accessories designed for work, gaming and
          everyday productivity.
        </p>
      </div>

      <SearchBar search={search} setSearch={setSearch} />

      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6 sm:mt-10 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Product Collection
          </h2>

          <p className="text-gray-500">Browse our available products</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
          <label htmlFor="product-sort" className="font-medium text-gray-700">
            Sort By
          </label>

          <select
            value={sortOption}
            id="product-sort"
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-3 sm:py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Default</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>
      </div>

      <FeaturedProducts
        title="All Products"
        description="Browse our complete collection of quality computer gadgets and accessories."
        search={search}
        selectedCategory={selectedCategory}
        sortOption={sortOption}
        addToCart={addToCart}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
      />
    </section>
  );
}

export default Products;
