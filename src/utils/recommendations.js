const getRecommendations = (currentProduct, products) => {
  if (!currentProduct || !Array.isArray(products)) return [];

  // Product categories that naturally complement one another
  const complementaryCategories = {
    Laptops: ["Accessories", "Mice", "Keyboards", "Monitors"],
    "Desktop Computers": ["Monitors", "Keyboards", "Mice", "Accessories"],
    Monitors: ["Desktop Computers", "Laptops"],
    Keyboards: ["Mice", "Desktop Computers", "Laptops"],
    Mice: ["Keyboards", "Laptops", "Desktop Computers"],
    Accessories: ["Laptops", "Desktop Computers"],
  };

  // Convert values such as "₦850,000" to 850000
  const parsePrice = (price) => {
    if (typeof price === "number") return price;

    return Number(String(price || "").replace(/[^\d.]/g, "")) || 0;
  };

  // Safely convert Supabase array values to arrays
  const normaliseArray = (value) => {
    return Array.isArray(value) ? value : [];
  };

  // Compare two arrays and return common values
  const getCommonValues = (firstArray, secondArray) => {
    const first = normaliseArray(firstArray);
    const second = normaliseArray(secondArray);

    return first.filter((value) => second.includes(value));
  };

  const currentPrice = parsePrice(currentProduct.price);

  /*
   * Maximum recommendation score.
   *
   * Same category             = 5
   * Same brand                = 3
   * Same type                 = 2
   * Similar price             = 3
   * High rating               = 2
   * Complementary category    = 4
   * Shared purpose            = 5
   * Same performance level    = 3
   * Shared connection         = 3
   *
   * Some rules are alternatives in practice, but 26 provides
   * a consistent reference for calculating the match percentage.
   */
  const MAX_SCORE = 26;

  return products
    .filter((product) => String(product.id) !== String(currentProduct.id))
    .map((product) => {
      let score = 0;
      const reasons = [];

      // ------------------------------------------------
      // Rule 1: Same product category
      // ------------------------------------------------
      if (product.category === currentProduct.category) {
        score += 5;
        reasons.push(`Same ${product.category} category`);
      }

      // ------------------------------------------------
      // Rule 2: Same brand
      // ------------------------------------------------
      if (product.brand === currentProduct.brand) {
        score += 3;
        reasons.push(`Same ${product.brand} brand`);
      }

      // ------------------------------------------------
      // Rule 3: Same product type
      // ------------------------------------------------
      if (
        product.type &&
        currentProduct.type &&
        product.type === currentProduct.type
      ) {
        score += 2;
        reasons.push("Same product type");
      }

      // ------------------------------------------------
      // Rule 4: Similar price range
      // ------------------------------------------------
      const productPrice = parsePrice(product.price);
      const priceDifference = Math.abs(currentPrice - productPrice);

      if (currentPrice > 0 && productPrice > 0 && priceDifference <= 300000) {
        score += 3;
        reasons.push("Similar price range");
      }

      // ------------------------------------------------
      // Rule 5: Highly rated product
      // ------------------------------------------------
      if (Number(product.rating) >= 5) {
        score += 2;
        reasons.push("Highly rated product");
      }

      // ------------------------------------------------
      // Rule 6: Complementary product category
      // ------------------------------------------------
      const isComplementary = complementaryCategories[
        currentProduct.category
      ]?.includes(product.category);

      if (isComplementary) {
        score += 4;
        reasons.push(
          `Complements your ${currentProduct.category.toLowerCase()}`,
        );
      }

      // ------------------------------------------------
      // Rule 7: Shared intended purpose
      // ------------------------------------------------
      const commonPurposes = getCommonValues(
        currentProduct.purposes,
        product.purposes,
      );

      if (commonPurposes.length > 0) {
        score += 5;

        reasons.push(
          `Suitable for ${commonPurposes.slice(0, 2).join(" and ")}`,
        );
      }

      // ------------------------------------------------
      // Rule 8: Similar performance level
      // ------------------------------------------------
      if (
        product.performance_level &&
        currentProduct.performance_level &&
        product.performance_level === currentProduct.performance_level
      ) {
        score += 3;

        reasons.push(
          `Similar ${product.performance_level.toLowerCase()} performance level`,
        );
      }

      // ------------------------------------------------
      // Rule 9: Shared connection/interface
      // ------------------------------------------------
      const commonConnections = getCommonValues(
        currentProduct.connections,
        product.connections,
      );

      if (commonConnections.length > 0) {
        score += 3;

        reasons.push(
          `Shared connection: ${commonConnections.slice(0, 2).join(", ")}`,
        );
      }

      // Convert the rule score into an explainable percentage.
      const matchPercentage = Math.min(
        100,
        Math.round((score / MAX_SCORE) * 100),
      );

      return {
        ...product,
        score,
        matchPercentage,

        // Keep this for compatibility with existing UI code.
        reason: reasons[0] || "Recommended for you",

        // New explainable recommendation information.
        reasons:
          reasons.length > 0
            ? reasons
            : ["Recommended based on your current product"],
      };
    })
    .filter((product) => product.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return Number(b.rating || 0) - Number(a.rating || 0);
    })
    .slice(0, 4);
};

export default getRecommendations;
