const getRecommendations = (currentProduct, products) => {
  if (!currentProduct) return [];

  // Categories that naturally go together
  const complementaryCategories = {
    Laptops: ["Accessories", "Mice", "Keyboards", "Monitors"],
    "Desktop Computers": ["Monitors", "Keyboards", "Mice"],
    Monitors: ["Desktop Computers", "Laptops"],
    Keyboards: ["Mice", "Desktop Computers", "Laptops"],
    Mice: ["Keyboards", "Laptops", "Desktop Computers"],
    Accessories: ["Laptops", "Desktop Computers"],
  };

  // Convert price string (₦850,000) to number (850000)
  const currentPrice = Number(currentProduct.price.replace(/[₦,]/g, ""));

  return products
    .filter((product) => product.id !== currentProduct.id)
    .map((product) => {
      let score = 0;

      // Rule 1: Same Category
      if (product.category === currentProduct.category) {
        score += 5;
      }

      // Rule 2: Same Brand
      if (product.brand === currentProduct.brand) {
        score += 3;
      }

      // Rule 3: Same Type
      if (product.type === currentProduct.type) {
        score += 2;
      }

      // Rule 4: Similar Price
      const productPrice = Number(product.price.replace(/[₦,]/g, ""));

      const priceDifference = Math.abs(currentPrice - productPrice);

      if (priceDifference <= 300000) {
        score += 3;
      }

      // Rule 5: High Rating
      if (product.rating >= 5) {
        score += 2;
      }

      // Rule 6: Complementary Products
      if (
        complementaryCategories[currentProduct.category]?.includes(
          product.category,
        )
      ) {
        score += 4;
      }

      let reason = "Recommended for you";

      // Highest priority reason
      if (product.category === currentProduct.category) {
        reason = "Similar category";
      } else if (product.brand === currentProduct.brand) {
        reason = "Same brand";
      } else if (
        complementaryCategories[currentProduct.category]?.includes(
          product.category,
        )
      ) {
        reason = "Frequently bought together";
      } else if (product.rating >= 5) {
        reason = "Highly rated";
      } else if (priceDifference <= 300000) {
        reason = "Similar price";
      }

      return {
        ...product,
        score,
        reason,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
};

export default getRecommendations;
