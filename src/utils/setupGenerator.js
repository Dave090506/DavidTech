import { checkCompatibility } from "./compatibility";

const parsePrice = (price) => {
  if (typeof price === "number") return price;

  return Number(String(price || "").replace(/[^\d.]/g, "")) || 0;
};

const normalizeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

const performanceScores = {
  Budget: 1,
  Standard: 2,
  High: 3,
  Premium: 4,
};

const priorityWeights = {
  Budget: {
    purpose: 5,
    performance: 2,
    rating: 1,
    price: 5,
  },

  Balanced: {
    purpose: 5,
    performance: 3,
    rating: 2,
    price: 3,
  },

  Performance: {
    purpose: 5,
    performance: 5,
    rating: 2,
    price: 1,
  },
};
const compatibilityScores = {
  Compatible: 3,
  "Adapter Required": 2,
  Unknown: 1,
  "Not Compatible": 0,
};

const scoreProduct = (product, purpose, priority, categoryBudget) => {
  const weights = priorityWeights[priority] || priorityWeights.Balanced;

  let score = 0;
  const reasons = [];

  const purposes = normalizeArray(product.purposes);

  // Rule 1: Intended use
  if (purposes.includes(purpose)) {
    score += weights.purpose;
    reasons.push(`Suitable for ${purpose}`);
  }

  // Rule 2: Performance level
  const performanceValue = performanceScores[product.performance_level] || 0;

  if (performanceValue > 0) {
    score += performanceValue * weights.performance;

    reasons.push(`${product.performance_level} performance level`);
  }

  // Rule 3: Product rating
  const rating = Number(product.rating || 0);

  if (rating >= 5) {
    score += weights.rating * 2;
    reasons.push("Highly rated product");
  } else if (rating >= 4) {
    score += weights.rating;
  }

  // Rule 4: Budget suitability
  const price = parsePrice(product.price);

  if (price > 0 && price <= categoryBudget) {
    score += weights.price * 2;
    reasons.push("Fits the allocated budget");
  } else if (price > 0 && price <= categoryBudget * 1.15) {
    score += weights.price;
    reasons.push("Close to the allocated budget");
  }

  return {
    ...product,
    setupScore: score,
    setupReasons: reasons,
    numericPrice: price,
  };
};

const getBudgetAllocations = (
  mainComputerType,
  selectedCategories,
  priority,
) => {
  /*
   * These are relative weights rather than fixed percentages.
   * They are normalized later based on the components selected
   * by the customer.
   */

  const allocations = {
    Laptops: 50,
    "Desktop Computers": 45,
    Monitors: 25,
    Keyboards: 10,
    Mice: 8,
    Accessories: 12,
  };

  if (priority === "Performance") {
    allocations.Laptops = 60;
    allocations["Desktop Computers"] = 55;
    allocations.Monitors = 25;
  }

  if (priority === "Budget") {
    allocations.Laptops = 45;
    allocations["Desktop Computers"] = 40;
    allocations.Monitors = 20;
  }

  const categories = [
    mainComputerType,
    ...selectedCategories.filter((category) => category !== mainComputerType),
  ];

  const totalWeight = categories.reduce(
    (total, category) => total + (allocations[category] || 10),
    0,
  );

  return categories.reduce((result, category) => {
    result[category] = (allocations[category] || 10) / totalWeight;

    return result;
  }, {});
};

const selectBestProduct = (
  products,
  category,
  purpose,
  priority,
  categoryBudget,
) => {
  const candidates = products
    .filter((product) => product.category === category)
    .map((product) => scoreProduct(product, purpose, priority, categoryBudget))
    .filter(
      (product) =>
        product.numericPrice > 0 && product.numericPrice <= categoryBudget,
    )
    .sort((a, b) => {
      if (b.setupScore !== a.setupScore) {
        return b.setupScore - a.setupScore;
      }

      // When scores tie, prefer the cheaper product.
      return a.numericPrice - b.numericPrice;
    });

  return candidates[0] || null;
};

const selectBestCompatibleProduct = (
  products,
  category,
  purpose,
  priority,
  categoryBudget,
  mainComputer,
) => {
  const candidates = products
    .filter((product) => product.category === category)
    .map((product) => {
      const scoredProduct = scoreProduct(
        product,
        purpose,
        priority,
        categoryBudget,
      );

      const compatibility = checkCompatibility(mainComputer, product);

      return {
        ...scoredProduct,
        compatibility,
        compatibilityScore: compatibilityScores[compatibility.status] ?? 0,
      };
    })
    .filter(
      (product) =>
        product.numericPrice > 0 &&
        product.numericPrice <= categoryBudget &&
        product.compatibility.status !== "Not Compatible",
    )
    .sort((a, b) => {
      // First prefer the stronger compatibility result.
      if (b.compatibilityScore !== a.compatibilityScore) {
        return b.compatibilityScore - a.compatibilityScore;
      }

      // Then use the normal setup recommendation score.
      if (b.setupScore !== a.setupScore) {
        return b.setupScore - a.setupScore;
      }

      // If both are equal, prefer the cheaper product.
      return a.numericPrice - b.numericPrice;
    });

  return candidates[0] || null;
};

const validateSetupCompatibility = (selectedProducts) => {
  if (selectedProducts.length < 2) return [];

  const mainComputer = selectedProducts.find(
    (product) =>
      product.category === "Laptops" ||
      product.category === "Desktop Computers",
  );

  if (!mainComputer) return [];

  return selectedProducts
    .filter((product) => product.id !== mainComputer.id)
    .map((product) => ({
      productId: product.id,
      productName: product.name,
      result: checkCompatibility(mainComputer, product),
    }));
};

export const generateSetup = ({
  products,
  purpose,
  budget,
  mainComputerType,
  selectedCategories = [],
  priority = "Balanced",
}) => {
  const numericBudget = Number(budget);

  if (!Array.isArray(products) || products.length === 0) {
    return {
      success: false,
      message: "No products are available.",
    };
  }

  if (!purpose) {
    return {
      success: false,
      message: "Select what the setup will be used for.",
    };
  }

  if (!numericBudget || numericBudget <= 0) {
    return {
      success: false,
      message: "Enter a valid budget.",
    };
  }

  if (!["Laptops", "Desktop Computers"].includes(mainComputerType)) {
    return {
      success: false,
      message: "Select a laptop or desktop as the main computer.",
    };
  }

  const categories = [
    mainComputerType,
    ...selectedCategories.filter(
      (category) =>
        category !== mainComputerType &&
        !["Laptops", "Desktop Computers"].includes(category),
    ),
  ];

  const uniqueCategories = [...new Set(categories)];

  const budgetAllocations = getBudgetAllocations(
    mainComputerType,
    uniqueCategories,
    priority,
  );

  const selectedProducts = [];
  let missingCategories = [];

  // -------------------------------------------
  // PASS 1: Select products using category budgets
  // -------------------------------------------

  // Select the main computer first.
  const mainComputerBudget =
    numericBudget * (budgetAllocations[mainComputerType] || 0);

  const mainComputer = selectBestProduct(
    products,
    mainComputerType,
    purpose,
    priority,
    mainComputerBudget,
  );

  if (mainComputer) {
    selectedProducts.push({
      ...mainComputer,
      allocatedBudget: Math.round(mainComputerBudget),
    });
  } else {
    missingCategories.push(mainComputerType);
  }

  // Select the other requested components using
  // both their allocated budget and compatibility.
  uniqueCategories
    .filter((category) => category !== mainComputerType)
    .forEach((category) => {
      const categoryBudget = numericBudget * (budgetAllocations[category] || 0);

      let selectedProduct = null;

      if (mainComputer) {
        selectedProduct = selectBestCompatibleProduct(
          products,
          category,
          purpose,
          priority,
          categoryBudget,
          mainComputer,
        );
      }

      if (selectedProduct) {
        selectedProducts.push({
          ...selectedProduct,
          allocatedBudget: Math.round(categoryBudget),
        });
      } else {
        missingCategories.push(category);
      }
    });

  // -------------------------------------------
  // PASS 2: Redistribute unused overall budget
  // -------------------------------------------

  if (mainComputer && missingCategories.length > 0) {
    let currentTotal = selectedProducts.reduce(
      (sum, product) => sum + product.numericPrice,
      0,
    );

    const stillMissing = [];

    missingCategories.forEach((category) => {
      // The main computer should not be replaced during
      // the redistribution pass.
      if (category === mainComputerType) {
        stillMissing.push(category);
        return;
      }

      const remainingBudget = numericBudget - currentTotal;

      if (remainingBudget <= 0) {
        stillMissing.push(category);
        return;
      }

      const selectedProduct = selectBestCompatibleProduct(
        products,
        category,
        purpose,
        priority,
        remainingBudget,
        mainComputer,
      );

      if (selectedProduct) {
        selectedProducts.push({
          ...selectedProduct,

          // During redistribution, the remaining overall
          // budget becomes the maximum available amount.
          allocatedBudget: Math.round(remainingBudget),
          usedRedistributedBudget: true,
        });

        currentTotal += selectedProduct.numericPrice;
      } else {
        stillMissing.push(category);
      }
    });

    missingCategories = stillMissing;
  }

  const total = selectedProducts.reduce(
    (sum, product) => sum + product.numericPrice,
    0,
  );

  const remainingBudget = numericBudget - total;

  const compatibilityResults = validateSetupCompatibility(selectedProducts);

  const hasCompatibilityProblem = compatibilityResults.some(
    (item) => item.result.status === "Not Compatible",
  );

  const requiresAdapter = compatibilityResults.some(
    (item) => item.result.status === "Adapter Required",
  );

  return {
    success: selectedProducts.length > 0,
    purpose,
    priority,
    budget: numericBudget,
    selectedProducts,
    total,
    remainingBudget,
    withinBudget: total <= numericBudget,
    missingCategories,
    compatibilityResults,
    hasCompatibilityProblem,
    requiresAdapter,
  };
};

export default generateSetup;
