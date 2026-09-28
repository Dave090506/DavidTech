const categoryRules = [
  {
    category: "Laptops",
    keywords: ["laptops", "laptop", "notebooks", "notebook"],
  },
  {
    category: "Desktop Computers",
    keywords: [
      "desktop computers",
      "desktop computer",
      "desktops",
      "desktop",
      "pcs",
      "pc",
    ],
  },
  {
    category: "Monitors",
    keywords: ["monitors", "monitor", "displays", "display"],
  },
  {
    category: "Keyboards",
    keywords: ["keyboards", "keyboard"],
  },
  {
    category: "Mice",
    keywords: ["mice", "mouse"],
  },
  {
    category: "Accessories",
    keywords: ["accessories", "accessory"],
  },
];

const commandWords = [
  "show me",
  "search for",
  "find me",
  "find",
  "search",
  "show",
  "look for",
  "i need",
];

const cleanCommand = (transcript) => {
  let cleanedText = transcript.toLowerCase().trim();

  commandWords.forEach((command) => {
    if (cleanedText.startsWith(command)) {
      cleanedText = cleanedText.slice(command.length).trim();
    }
  });

  return cleanedText;
};

const extractCategory = (text) => {
  for (const rule of categoryRules) {
    const matchedKeyword = rule.keywords.find((keyword) =>
      text.includes(keyword),
    );

    if (matchedKeyword) {
      return {
        category: rule.category,
        matchedKeyword,
      };
    }
  }

  return {
    category: null,
    matchedKeyword: null,
  };
};

const extractMaximumPrice = (text) => {
  const priceMatch = text.match(
    /(?:under|below|less than|maximum|max|up to)\s+(?:₦|\$|ngn|naira)?\s*([\d,.]+)\s*(thousand|million|m)?/i,
  );

  if (!priceMatch) {
    return null;
  }

  let value = Number(priceMatch[1].replace(/,/g, ""));

  if (Number.isNaN(value)) {
    return null;
  }

  const multiplier = priceMatch[2]?.toLowerCase();

  if (multiplier === "thousand") {
    value *= 1000;
  }

  if (multiplier === "million" || multiplier === "m") {
    value *= 1000000;
  }

  return value;
};

const removePriceExpression = (text) =>
  text
    .replace(
      /(?:under|below|less than|maximum|max|up to)\s+(?:₦|\$|ngn|naira)?\s*[\d,.]+\s*(?:thousand|million|m)?(?:\s*naira)?/gi,
      "",
    )
    .trim();

export const parseVoiceSearch = (transcript) => {
  const cleanedCommand = cleanCommand(transcript);

  const { category, matchedKeyword } = extractCategory(cleanedCommand);

  const maxPrice = extractMaximumPrice(cleanedCommand);

  let searchText = removePriceExpression(cleanedCommand);

  if (matchedKeyword) {
    searchText = searchText
      .replace(matchedKeyword, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  return {
    originalTranscript: transcript,
    cleanedCommand,
    searchText,
    category,
    maxPrice,
  };
};
