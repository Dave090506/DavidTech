import ProductCard from "./ProductCard";

function RecentlyViewed({ products, addToCart, wishlist, toggleWishlist }) {
  if (!products.length) return null;

  return (
    <section className="mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Recently Viewed
        </h2>

        <p className="text-gray-500 mb-10">
          Continue exploring products you've recently viewed.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              image={product.image}
              name={product.name}
              price={product.price}
              rating={product.rating}
              badge={product.badge}
              brand={product.brand}
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecentlyViewed;
