import { useEffect, useState } from "react";
import {
  FaLaptop,
  FaDesktop,
  FaMagic,
  FaWallet,
  FaShieldAlt,
  FaCogs,
  FaShoppingCart,
} from "react-icons/fa";

import { supabase } from "../services/supabaseClient";
import generateSetup from "../utils/setupGenerator";
import localProducts from "../data/products";
import { toast } from "react-toastify";

const getProductImage = (product) => {
  if (!product?.image) return "";

  if (
    product.image.startsWith("data:") ||
    product.image.startsWith("http://") ||
    product.image.startsWith("https://") ||
    product.image.startsWith("blob:")
  ) {
    return product.image;
  }

  const localProduct = localProducts.find(
    (item) => Number(item.id) === Number(product.id),
  );

  return localProduct?.image || "";
};

const purposes = [
  "Programming",
  "Gaming",
  "Graphic Design",
  "Office Work",
  "School",
  "General Use",
];

const optionalComponents = ["Monitors", "Keyboards", "Mice", "Accessories"];

function BuildSetup({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [purpose, setPurpose] = useState("Programming");
  const [budget, setBudget] = useState("");
  const [mainComputerType, setMainComputerType] = useState("Laptops");

  const [selectedCategories, setSelectedCategories] = useState([
    "Monitors",
    "Keyboards",
    "Mice",
  ]);

  const [priority, setPriority] = useState("Balanced");

  const [setupResult, setSetupResult] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error loading products:", error);
        setProducts([]);
        setLoadingProducts(false);
        return;
      }

      const formattedProducts = (data || []).map((product) => ({
        ...product,
        image: getProductImage(product),
      }));

      setProducts(formattedProducts);
      setLoadingProducts(false);
    };

    loadProducts();
  }, []);

  const toggleCategory = (category) => {
    setSelectedCategories((currentCategories) =>
      currentCategories.includes(category)
        ? currentCategories.filter((item) => item !== category)
        : [...currentCategories, category],
    );
  };

  const handleGenerateSetup = (event) => {
    event.preventDefault();

    setFormError("");
    setSetupResult(null);

    const result = generateSetup({
      products,
      purpose,
      budget,
      mainComputerType,
      selectedCategories,
      priority,
    });

    if (!result.success) {
      setFormError(result.message);
      return;
    }

    setSetupResult(result);
  };
  const handleAddSetupToCart = () => {
    if (!setupResult?.selectedProducts?.length) return;

    if (setupResult.hasCompatibilityProblem) {
      setFormError(
        "This setup contains an unsupported product pairing. Please generate another setup before adding it to your cart.",
      );

      return;
    }

    setupResult.selectedProducts.forEach((product) => {
      addToCart(product, 1, false);
    });

    toast.success(
      `${setupResult.selectedProducts.length} products from your setup were added to cart!`,
    );
  };

  return (
    <section className="min-h-screen bg-gray-50 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full">
            <FaMagic />
            Smart Setup Builder
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-5">
            Build My Setup
          </h1>

          <p className="text-gray-600 mt-4 text-base sm:text-lg leading-7 sm:leading-8 max-w-3xl mx-auto">
            Tell DavidTech what you need and your budget. Our rule-based setup
            builder selects suitable products from the current catalogue and
            checks how well the selected components work together.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <span className="inline-flex items-center gap-2 bg-white border border-blue-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
              <FaWallet className="text-blue-600" />
              Budget-aware
            </span>

            <span className="inline-flex items-center gap-2 bg-white border border-green-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
              <FaShieldAlt className="text-green-600" />
              Compatibility checked
            </span>

            <span className="inline-flex items-center gap-2 bg-white border border-indigo-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
              <FaCogs className="text-indigo-600" />
              Rule-based selection
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          {/* Setup Form */}
          <form
            onSubmit={handleGenerateSetup}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-7 lg:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                  Step 1
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  Your Requirements
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  Choose what you need and we'll build a suitable setup around
                  your budget.
                </p>
              </div>

              <div className="hidden sm:flex w-11 h-11 rounded-xl bg-blue-50 text-blue-600 items-center justify-center shrink-0">
                <FaLaptop className="text-xl" />
              </div>
            </div>

            {/* Purpose */}
            <div className="mt-7">
              <label
                htmlFor="setup-purpose"
                className="block font-semibold text-gray-800 mb-2"
              >
                What will you use the setup for?
              </label>

              <select
                id="setup-purpose"
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-blue-500"
              >
                {purposes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div className="mt-6">
              <label
                htmlFor="setup-budget"
                className="block font-semibold text-gray-800 mb-2"
              >
                Total Budget (₦)
              </label>

              <input
                id="setup-budget"
                type="number"
                min="1"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                placeholder="Example: 2000000"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              />

              {budget && Number(budget) > 0 && (
                <div className="flex items-center justify-between gap-3 mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FaWallet className="text-blue-600" />

                    <span className="text-sm text-gray-600">
                      Your maximum budget
                    </span>
                  </div>

                  <span className="font-bold text-blue-700">
                    ₦{Number(budget).toLocaleString()}
                  </span>
                </div>
              )}

              <p className="text-sm text-gray-500 mt-2">
                Enter the maximum amount you want to spend on the complete
                setup.
              </p>
            </div>

            {/* Main Computer */}
            <div className="mt-6">
              <p className="font-semibold text-gray-800 mb-3">Main Computer</p>

              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setMainComputerType("Laptops")}
                  className={`p-4 rounded-xl border-2 transition flex items-center gap-3 ${
                    mainComputerType === "Laptops"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <FaLaptop className="text-2xl" />

                  <span className="font-semibold">Laptop</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMainComputerType("Desktop Computers")}
                  className={`p-4 rounded-xl border-2 transition flex items-center gap-3 ${
                    mainComputerType === "Desktop Computers"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <FaDesktop className="text-2xl" />

                  <span className="font-semibold">Desktop</span>
                </button>
              </div>
            </div>

            {/* Optional Components */}
            <div className="mt-6">
              <p className="font-semibold text-gray-800">
                Components to Include
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Your selected laptop or desktop is included automatically.
              </p>

              <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
                <FaCogs />
                {selectedCategories.length + 1} component
                {selectedCategories.length + 1 !== 1 ? "s" : ""} selected
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {optionalComponents.map((category) => {
                  const selected = selectedCategories.includes(category);

                  return (
                    <label
                      key={category}
                      className={`flex items-center gap-3 border-2 rounded-xl p-4 cursor-pointer transition ${
                        selected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleCategory(category)}
                        className="w-5 h-5 accent-blue-600"
                      />

                      <span className="font-medium text-gray-800">
                        {category}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Priority */}
            <div className="mt-6">
              <label
                htmlFor="setup-priority"
                className="block font-semibold text-gray-800 mb-2"
              >
                Shopping Priority
              </label>

              <select
                id="setup-priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="Budget">
                  Budget — Keep costs as low as possible
                </option>

                <option value="Balanced">
                  Balanced — Balance price and performance
                </option>

                <option value="Performance">
                  Performance — Prioritize stronger products
                </option>
              </select>

              <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <p className="text-sm text-gray-600 leading-6">
                  {priority === "Budget" &&
                    "Focuses more strongly on lower-cost products while still matching your selected purpose."}

                  {priority === "Balanced" &&
                    "Balances product suitability, performance and price for an all-round setup."}

                  {priority === "Performance" &&
                    "Gives greater priority to stronger-performing products while staying within your budget."}
                </p>
              </div>
            </div>

            {formError && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={loadingProducts}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2"
            >
              <FaMagic />

              {loadingProducts ? "Loading Products..." : "Generate My Setup"}
            </button>
          </form>

          {/* Results Area */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-7">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Step 2
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                Your Suggested Setup
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Review the selected products, budget usage and compatibility.
              </p>
            </div>

            {!setupResult ? (
              <div className="min-h-96 flex items-center justify-center text-center">
                <div className="max-w-md w-full">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FaDesktop className="text-3xl" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mt-5">
                    Ready to build your setup?
                  </h3>

                  <p className="text-gray-500 mt-2 leading-6">
                    Complete your requirements and let DavidTech create a
                    suitable combination from the current catalogue.
                  </p>

                  <div className="grid grid-cols-3 gap-3 mt-7">
                    <div className="border border-gray-200 bg-gray-50 rounded-xl p-3">
                      <div className="w-7 h-7 mx-auto rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                        1
                      </div>

                      <p className="text-xs font-semibold text-gray-700 mt-2">
                        Set Needs
                      </p>
                    </div>

                    <div className="border border-gray-200 bg-gray-50 rounded-xl p-3">
                      <div className="w-7 h-7 mx-auto rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                        2
                      </div>

                      <p className="text-xs font-semibold text-gray-700 mt-2">
                        Generate
                      </p>
                    </div>

                    <div className="border border-gray-200 bg-gray-50 rounded-xl p-3">
                      <div className="w-7 h-7 mx-auto rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                        3
                      </div>

                      <p className="text-xs font-semibold text-gray-700 mt-2">
                        Review
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <div
                  className={`rounded-xl p-5 border ${
                    setupResult.missingCategories.length === 0
                      ? "bg-green-50 border-green-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <p
                    className={`font-bold ${
                      setupResult.missingCategories.length === 0
                        ? "text-green-700"
                        : "text-yellow-800"
                    }`}
                  >
                    {setupResult.missingCategories.length === 0
                      ? "Setup Generated Successfully"
                      : "Partial Setup Generated"}
                  </p>

                  <p className="text-gray-600 mt-2">
                    {setupResult.selectedProducts.length} product
                    {setupResult.selectedProducts.length !== 1 ? "s" : ""}{" "}
                    selected for {setupResult.purpose}.
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  {setupResult.selectedProducts.map((item) => (
                    <div
                      key={item.id}
                      className="group border border-gray-200 rounded-2xl p-4 sm:p-5 flex gap-4 bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center p-2">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">
                            No image
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <span className="inline-flex bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {item.category}
                        </span>

                        <h3 className="font-bold text-gray-900 mt-2 leading-snug">
                          {item.name}
                        </h3>

                        <p className="font-bold text-blue-600 text-lg mt-1">
                          {item.price}
                        </p>
                        {Array.isArray(item.setupReasons) &&
                          item.setupReasons.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-semibold text-gray-700">
                                Why selected:
                              </p>

                              <ul className="mt-1 space-y-1">
                                {item.setupReasons
                                  .slice(0, 3)
                                  .map((reason, index) => (
                                    <li
                                      key={`${reason}-${index}`}
                                      className="text-xs text-gray-500 flex items-start gap-1.5"
                                    >
                                      <span className="text-green-600 font-bold">
                                        ✓
                                      </span>
                                      <span>{reason}</span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-500">
                        Budget Usage
                      </p>

                      <h3 className="text-lg font-bold text-gray-900 mt-1">
                        Setup Cost Summary
                      </h3>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <FaWallet className="text-xl" />
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600">Total Budget</span>

                      <span className="font-semibold text-gray-900">
                        ₦{setupResult.budget.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600">Setup Total</span>

                      <span className="font-bold text-blue-600">
                        ₦{setupResult.total.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600">Remaining Budget</span>

                      <span
                        className={`font-bold ${
                          setupResult.remainingBudget >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ₦{setupResult.remainingBudget.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 mt-5 pt-4">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Budget used
                      </span>

                      <span className="text-sm font-bold text-blue-600">
                        {Math.min(
                          100,
                          Math.round(
                            (setupResult.total / setupResult.budget) * 100,
                          ),
                        )}
                        %
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              (setupResult.total / setupResult.budget) * 100,
                            ),
                          )}%`,
                        }}
                      />
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      ₦{setupResult.total.toLocaleString()} of ₦
                      {setupResult.budget.toLocaleString()} used
                    </p>
                  </div>
                </div>

                {/* Setup Compatibility */}
                {setupResult.compatibilityResults.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                        <FaShieldAlt className="text-lg" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Setup Compatibility
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Compatibility is checked against the selected main
                          computer.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 mt-5">
                      {setupResult.compatibilityResults.map((item) => (
                        <div
                          key={item.productId}
                          className={`rounded-xl border p-4 ${
                            item.result.status === "Compatible"
                              ? "bg-green-50 border-green-200"
                              : item.result.status === "Adapter Required"
                                ? "bg-yellow-50 border-yellow-200"
                                : item.result.status === "Unknown"
                                  ? "bg-gray-50 border-gray-200"
                                  : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-semibold text-gray-900 min-w-0">
                              {item.productName}
                            </p>

                            <span
                              className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${
                                item.result.status === "Compatible"
                                  ? "bg-green-600 text-white"
                                  : item.result.status === "Adapter Required"
                                    ? "bg-yellow-500 text-white"
                                    : item.result.status === "Unknown"
                                      ? "bg-gray-600 text-white"
                                      : "bg-red-600 text-white"
                              }`}
                            >
                              {item.result.status}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mt-2">
                            {item.result.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {setupResult.missingCategories.length > 0 && (
                  <div className="mt-5 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="font-semibold text-yellow-800">
                      Some components could not be included
                    </p>

                    <p className="text-sm text-yellow-700 mt-1">
                      No suitable product could be included within the remaining
                      budget and compatibility requirements for:{" "}
                      {setupResult.missingCategories.join(", ")}.
                    </p>
                  </div>
                )}

                {/* Add Complete Setup to Cart */}
                <div className="mt-6">
                  {setupResult.hasCompatibilityProblem && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="font-semibold text-red-700">
                        Setup needs adjustment
                      </p>

                      <p className="text-sm text-red-600 mt-1">
                        One or more selected products are not a supported
                        pairing with the main computer. Generate another setup
                        before adding the complete setup to your cart.
                      </p>
                    </div>
                  )}

                  {setupResult.requiresAdapter &&
                    !setupResult.hasCompatibilityProblem && (
                      <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <p className="font-semibold text-yellow-800">
                          Adapter may be required
                        </p>

                        <p className="text-sm text-yellow-700 mt-1">
                          This setup contains a product that requires an adapter
                          to connect to the main computer.
                        </p>
                      </div>
                    )}

                  <button
                    type="button"
                    onClick={handleAddSetupToCart}
                    disabled={setupResult.hasCompatibilityProblem}
                    className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                      setupResult.hasCompatibilityProblem
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white active:scale-[0.99]"
                    }`}
                  >
                    <FaShoppingCart className="text-lg" />

                    {setupResult.missingCategories.length === 0
                      ? "Add Complete Setup to Cart"
                      : "Add Available Setup to Cart"}
                  </button>

                  {!setupResult.hasCompatibilityProblem && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      {setupResult.missingCategories.length === 0
                        ? "All selected products will be added to your cart."
                        : "The available products shown above will be added to your cart."}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BuildSetup;
