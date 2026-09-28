import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleHomeVoiceCommand = (command) => {
    const params = new URLSearchParams();

    if (command.searchText) {
      params.set("search", command.searchText);
    }

    if (command.category) {
      params.set("category", command.category);
    }

    if (command.maxPrice !== null) {
      params.set("maxPrice", String(command.maxPrice));
    }

    navigate(`/products?${params.toString()}#all-products`);
  };
  return (
    <>
      <Hero />

      <SearchBar
        search={search}
        setSearch={setSearch}
        onVoiceCommand={handleHomeVoiceCommand}
      />

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
