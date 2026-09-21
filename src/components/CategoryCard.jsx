function CategoryCard({ name, icon, count, onClick, active }) {
  return (
    <div
      onClick={onClick}
      className={`group rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-center cursor-pointer transition-all duration-300 border
      ${
        active
          ? "bg-blue-600 text-white border-blue-600 shadow-xl sm:scale-105"
          : "bg-white border-gray-200 hover:border-blue-600 hover:-translate-y-2 hover:shadow-xl"
      }`}
    >
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-5 lg:mb-6 transition
        ${
          active
            ? "bg-white text-blue-600"
            : "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
        }`}
      >
        {icon}
      </div>

      <h3 className="text-sm sm:text-lg lg:text-xl font-bold leading-tight">
        {name}
      </h3>

      <p
        className={`mt-2 text-xs sm:text-sm lg:text-base ${
          active ? "text-blue-100" : "text-gray-500"
        }`}
      >
        {count} {count === 1 ? "Product" : "Products"}
      </p>
    </div>
  );
}

export default CategoryCard;
