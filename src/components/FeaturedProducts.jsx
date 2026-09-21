import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import localProducts from "../data/products";
import { supabase } from "../services/supabaseClient";

function FeaturedProducts({
  title = "Featured Products",
  description = "Explore our most popular laptops, desktops and accessories.",
  search = "",
  selectedCategory = "All",
  sortOption = "default",
  limit,
  addToCart,
  wishlist = [],
  toggleWishlist,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const getProductImage = (product) => {
    if (!product?.image) {
      return "";
    }

    if (
      product.image.startsWith("data:") ||
      product.image.startsWith("http://") ||
      product.image.startsWith("https://") ||
      product.image.startsWith("blob:")
    ) {
      return product.image;
    }

    const matchingLocalProduct = localProducts.find(
      (localProduct) => Number(localProduct.id) === Number(product.id),
    );

    return matchingLocalProduct?.image || "";
  };
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error loading store products:", error);
        setProducts([]);
        setLoading(false);
        return;
      }

      const formattedProducts = (data || []).map((product) => ({
        ...product,
        image: getProductImage(product),
      }));

      setProducts(formattedProducts);
      setLoading(false);
    };

    loadProducts();
  }, []);
  const filteredProducts = [...products]
    .filter((product) => {
      const searchTerms = search
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      const searchableText = [
        product.name,
        product.category,
        product.brand,
        product.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchTerms.every((term) =>
        searchableText.includes(term),
      );

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === "low") {
        return (
          Number(a.price.replace(/[₦,]/g, "")) -
          Number(b.price.replace(/[₦,]/g, ""))
        );
      }

      if (sortOption === "high") {
        return (
          Number(b.price.replace(/[₦,]/g, "")) -
          Number(a.price.replace(/[₦,]/g, ""))
        );
      }

      if (sortOption === "rating") {
        return b.rating - a.rating;
      }

      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      }

      return 0;
    });
  const displayedProducts = limit
    ? filteredProducts.slice(0, limit)
    : filteredProducts;

  return (
    <section className="bg-gray-100 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {title}
          </h2>

          <p className="text-base sm:text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
            {description}
          </p>
          <p className="mt-3 text-blue-600 font-semibold">
            Showing {displayedProducts.length}{" "}
            {displayedProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-10 sm:py-16">
            <p className="text-gray-500 text-lg">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  badge={product.badge}
                  product={product}
                  brand={product.brand}
                  addToCart={addToCart}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                />
              ))}
            </div>

            {limit && filteredProducts.length > limit && (
              <div className="flex justify-center mt-10">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  View All Products
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 sm:py-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-700">
              No Products Found
            </h3>

            <p className="text-gray-500 mt-3">
              Try changing your search or selecting another category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;
