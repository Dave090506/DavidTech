import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import { supabase } from "../services/supabaseClient";
import {
  FaLaptop,
  FaDesktop,
  FaTv,
  FaKeyboard,
  FaMouse,
  FaHeadphones,
  FaLayerGroup,
} from "react-icons/fa";

function Categories({ selectedCategory, setSelectedCategory }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, category");

      if (error) {
        console.error("Error loading category counts:", error);
        return;
      }

      setProducts(data || []);
    };

    loadProducts();
  }, []);

  const getCategoryCount = (categoryName) => {
    if (categoryName === "All") {
      return products.length;
    }

    return products.filter((product) => product.category === categoryName)
      .length;
  };
  const categories = [
    {
      name: "All",
      icon: <FaLayerGroup />,
      count: getCategoryCount("All"),
    },
    {
      name: "Laptops",
      icon: <FaLaptop />,
      count: getCategoryCount("Laptops"),
    },
    {
      name: "Desktop Computers",
      icon: <FaDesktop />,
      count: getCategoryCount("Desktop Computers"),
    },
    {
      name: "Monitors",
      icon: <FaTv />,
      count: getCategoryCount("Monitors"),
    },
    {
      name: "Keyboards",
      icon: <FaKeyboard />,
      count: getCategoryCount("Keyboards"),
    },
    {
      name: "Mice",
      icon: <FaMouse />,
      count: getCategoryCount("Mice"),
    },
    {
      name: "Accessories",
      icon: <FaHeadphones />,
      count: getCategoryCount("Accessories"),
    },
  ];

  return (
    <section className="py-10 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
            Browse Our Categories
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Discover premium computer gadgets for work, gaming and everyday
            productivity.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-8">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              name={category.name}
              icon={category.icon}
              count={category.count}
              onClick={() => setSelectedCategory(category.name)}
              active={selectedCategory === category.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
