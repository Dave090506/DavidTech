import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import LiveActivity from "../components/LiveActivity";

function Home({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  addToCart,
  wishlist,
  toggleWishlist,
}) {
  return (
    <>
      <Hero />

      <SearchBar search={search} setSearch={setSearch} />

      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <FeaturedProducts
        search={search}
        selectedCategory={selectedCategory}
        limit={8}
        addToCart={addToCart}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
      />
      <LiveActivity />
    </>
  );
}

export default Home;
