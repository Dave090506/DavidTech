const customerNames = [
  "David",
  "Chinedum",
  "Esther",
  "Blessing",
  "Michael",
  "Samuel",
  "Grace",
  "Emmanuel",
  "Sophia",
  "Daniel",
  "Precious",
  "Joshua",
];

const cities = [
  "Lagos",
  "Abuja",
  "Asaba",
  "Port Harcourt",
  "Benin",
  "Enugu",
  "Owerri",
  "Warri",
  "Ibadan",
  "Uyo",
];

const activityTypes = [
  "purchase",
  "view",
  "wishlist",
  "trending",
  "bestseller",
];

// Different messages for more natural simulated activity
const activityMessages = {
  purchase: [
    "purchased this product",
    "just bought this product",
    "completed an order for this product",
  ],

  wishlist: [
    "added this product to their wishlist",
    "saved this product for later",
  ],

  view: [
    "customers are viewing this product",
    "customers recently viewed this product",
  ],

  trending: ["is getting more attention today", "is trending among shoppers"],

  bestseller: ["is one of our popular products", "is currently a best seller"],
};

export { customerNames, cities, activityTypes, activityMessages };
