const normalizeConnections = (connections) => {
  if (!Array.isArray(connections)) return [];

  return connections.map((connection) =>
    String(connection).trim().toLowerCase(),
  );
};

const categoryRelationships = {
  Laptops: ["Monitors", "Keyboards", "Mice", "Accessories"],
  "Desktop Computers": ["Monitors", "Keyboards", "Mice", "Accessories"],
  Monitors: ["Laptops", "Desktop Computers"],
  Keyboards: ["Laptops", "Desktop Computers"],
  Mice: ["Laptops", "Desktop Computers"],
  Accessories: ["Laptops", "Desktop Computers"],
};
const formatConnectionName = (connection) => {
  const names = {
    "usb-c": "USB-C",
    "usb-a": "USB-A",
    "usb receiver": "USB Receiver",
    bluetooth: "Bluetooth",
    hdmi: "HDMI",
    displayport: "DisplayPort",
    "3.5mm audio": "3.5mm Audio",
  };

  return names[connection] || connection;
};
// Connections that can communicate directly
const directConnectionGroups = [
  ["usb-c"],
  ["usb-a", "usb receiver"],
  ["bluetooth"],
  ["hdmi"],
  ["displayport"],
  ["3.5mm audio"],
];

// Known adapter/conversion possibilities used by DavidTech
const adapterConnections = [
  ["usb-c", "hdmi"],
  ["usb-c", "displayport"],
  ["displayport", "hdmi"],
];

const hasValidCategoryRelationship = (firstProduct, secondProduct) => {
  const allowedCategories = categoryRelationships[firstProduct.category] || [];

  return allowedCategories.includes(secondProduct.category);
};

const findDirectConnection = (firstConnections, secondConnections) => {
  for (const group of directConnectionGroups) {
    const firstMatch = group.find((connection) =>
      firstConnections.includes(connection),
    );

    const secondMatch = group.find((connection) =>
      secondConnections.includes(connection),
    );

    if (firstMatch && secondMatch) {
      return {
        first: firstMatch,
        second: secondMatch,
      };
    }
  }

  return null;
};

const findAdapterConnection = (firstConnections, secondConnections) => {
  for (const [connectionA, connectionB] of adapterConnections) {
    const forwardMatch =
      firstConnections.includes(connectionA) &&
      secondConnections.includes(connectionB);

    if (forwardMatch) {
      return {
        first: connectionA,
        second: connectionB,
      };
    }

    const reverseMatch =
      firstConnections.includes(connectionB) &&
      secondConnections.includes(connectionA);

    if (reverseMatch) {
      return {
        first: connectionB,
        second: connectionA,
      };
    }
  }

  return null;
};

export const checkCompatibility = (firstProduct, secondProduct) => {
  if (!firstProduct || !secondProduct) {
    return {
      status: "Unknown",
      reason: "Product information is incomplete.",
    };
  }

  // Prevent a product from being checked against itself
  if (String(firstProduct.id) === String(secondProduct.id)) {
    return {
      status: "Same Product",
      reason: "Select a different product for comparison.",
    };
  }

  // Check whether the product categories logically work together
  if (!hasValidCategoryRelationship(firstProduct, secondProduct)) {
    return {
      status: "Not Compatible",
      reason: `${firstProduct.category} and ${secondProduct.category} are not treated as a supported device pairing by the DavidTech compatibility checker.`,
    };
  }

  const firstConnections = normalizeConnections(firstProduct.connections);

  const secondConnections = normalizeConnections(secondProduct.connections);

  // We should not claim incompatibility when connection data is missing
  if (firstConnections.length === 0 || secondConnections.length === 0) {
    return {
      status: "Unknown",
      reason:
        "There is not enough connection information to determine compatibility.",
    };
  }

  // Direct connection
  const directConnection = findDirectConnection(
    firstConnections,
    secondConnections,
  );

  if (directConnection) {
    return {
      status: "Compatible",
      reason: `These products have a supported direct connection through ${formatConnectionName(
        directConnection.first,
      )}.`,
    };
  }

  // Adapter-based connection
  const adapterConnection = findAdapterConnection(
    firstConnections,
    secondConnections,
  );

  if (adapterConnection) {
    return {
      status: "Adapter Required",
      reason: `These products may be connected using a ${formatConnectionName(
        adapterConnection.first,
      )} to ${formatConnectionName(adapterConnection.second)} adapter.`,
      connection: `${adapterConnection.first} to ${adapterConnection.second}`,
    };
  }

  return {
    status: "Not Compatible",
    reason:
      "No supported direct connection or adapter path was found between these products.",
  };
};

export const getCompatibleProducts = (currentProduct, products) => {
  if (!currentProduct || !Array.isArray(products)) return [];

  return products
    .filter((product) => String(product.id) !== String(currentProduct.id))
    .map((product) => ({
      ...product,
      compatibility: checkCompatibility(currentProduct, product),
    }))
    .filter((product) =>
      ["Compatible", "Adapter Required"].includes(product.compatibility.status),
    );
};
