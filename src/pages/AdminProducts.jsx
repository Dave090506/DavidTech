import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import localProducts from "../data/products";
import { adminSupabase } from "../services/supabaseClient";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const getProductImage = (product) => {
  if (!product?.image) return "";

  if (
    product.image.startsWith("data:") ||
    product.image.startsWith("http://") ||
    product.image.startsWith("https://")
  ) {
    return product.image;
  }

  const localProduct = localProducts.find(
    (item) => Number(item.id) === Number(product.id),
  );

  return localProduct?.image || "";
};

function AdminProducts() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProductImageFile, setNewProductImageFile] = useState(null);
  const [editProductImageFile, setEditProductImageFile] = useState(null);
  // your newProduct state stays here
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);

      const { data, error } = await adminSupabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error loading products:", error);
        toast.error("Unable to load products.");
        setLoading(false);
        return;
      }

      setProductList(data || []);
      setLoading(false);
    };

    loadProducts();
  }, []);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    brand: "",
    type: "",
    price: "",
    image: "",
    rating: 5,
    badge: "",
  });
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    const { error } = await adminSupabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      toast.error("Unable to delete product.");
      return;
    }

    setProductList((currentProducts) =>
      currentProducts.filter((product) => product.id !== id),
    );

    toast.success("Product deleted successfully.");
  };
  const handleEdit = (product) => {
    setEditProductImageFile(null);
    setEditingProduct({ ...product });
    setShowModal(true);
  };
  const handleSaveChanges = async () => {
    if (!editingProduct) return;

    let imageUrl = editingProduct.image;

    // Only upload a new image when the admin actually selected one
    if (editProductImageFile) {
      const fileExtension =
        editProductImageFile.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

      const { error: uploadError } = await adminSupabase.storage
        .from("product-images")
        .upload(fileName, editProductImageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Error uploading edited product image:", uploadError);
        toast.error(uploadError.message || "Unable to upload product image.");
        return;
      }

      const { data: publicUrlData } = adminSupabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    const updatedProduct = {
      name: editingProduct.name,
      category: editingProduct.category,
      brand: editingProduct.brand,
      type: editingProduct.type || editingProduct.category,
      price: editingProduct.price,
      image: imageUrl,
      rating: Number(editingProduct.rating || 5),
      badge: editingProduct.badge || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await adminSupabase
      .from("products")
      .update(updatedProduct)
      .eq("id", editingProduct.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      toast.error(error.message || "Unable to update product.");
      return;
    }

    setProductList((currentProducts) =>
      currentProducts.map((product) =>
        product.id === data.id ? data : product,
      ),
    );

    setShowModal(false);
    setEditingProduct(null);
    setEditProductImageFile(null);

    toast.success("Product updated successfully.");
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setNewProductImageFile(file);

    const previewUrl = URL.createObjectURL(file);

    setNewProduct((currentProduct) => ({
      ...currentProduct,
      image: previewUrl,
    }));
  };
  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setEditProductImageFile(file);

    const previewUrl = URL.createObjectURL(file);

    setEditingProduct((currentProduct) => ({
      ...currentProduct,
      image: previewUrl,
    }));
  };
  const handleAddProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.category ||
      !newProduct.brand
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!newProductImageFile) {
      toast.error("Please select a product image.");
      return;
    }

    // Create a unique filename for Supabase Storage
    const fileExtension =
      newProductImageFile.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

    // Upload the actual image file
    const { error: uploadError } = await adminSupabase.storage
      .from("product-images")
      .upload(fileName, newProductImageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading product image:", uploadError);
      toast.error(uploadError.message || "Unable to upload product image.");
      return;
    }

    // Get the permanent public URL
    const { data: publicUrlData } = adminSupabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    const nextId =
      productList.length > 0
        ? Math.max(...productList.map((product) => Number(product.id))) + 1
        : 1;

    const productToAdd = {
      id: nextId,
      name: newProduct.name,
      category: newProduct.category,
      brand: newProduct.brand,
      type: newProduct.type.trim() || newProduct.category,
      price: newProduct.price,
      image: imageUrl,
      rating: Number(newProduct.rating || 5),
      badge: newProduct.badge.trim() || null,
    };

    const { data, error } = await adminSupabase
      .from("products")
      .insert(productToAdd)
      .select()
      .single();

    if (error) {
      console.error("Error adding product:", error);
      toast.error(error.message || "Unable to add product.");
      return;
    }

    setProductList((currentProducts) => [data, ...currentProducts]);

    setNewProduct({
      name: "",
      category: "",
      brand: "",
      type: "",
      price: "",
      image: "",
      rating: 5,
      badge: "",
    });

    setNewProductImageFile(null);
    setShowAddModal(false);

    toast.success("Product added successfully.");
  };
  return (
    <section className="min-h-screen bg-gray-100 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          <AdminSidebar />

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold">Products</h1>

                  <p className="text-gray-500 mt-2">
                    Manage your store products.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition font-semibold"
                >
                  <FaPlus />
                  Add Product
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-200">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-4">Image</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-10 text-center text-gray-500"
                      >
                        Loading products...
                      </td>
                    </tr>
                  ) : productList.length > 0 ? (
                    productList.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-4">
                          {getProductImage(product) ? (
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="w-16 h-16 object-contain"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 text-center">
                              No Image
                            </div>
                          )}
                        </td>

                        <td className="font-semibold">{product.name}</td>

                        <td>{product.category}</td>

                        <td>{product.price}</td>

                        <td>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                            In Stock
                          </span>
                        </td>

                        <td>
                          <div className="flex justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleEdit(product)}
                              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition"
                            >
                              <FaEdit />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(product.id)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-10 text-center text-gray-500"
                      >
                        No products available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Product Modal */}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-8 relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 pr-10">
              Edit Product
            </h2>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-2xl text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
            <div className="grid md:grid-cols-2 gap-5 mt-8">
              <div>
                <label
                  htmlFor="new-product-name"
                  className="block text-sm font-semibold mb-2"
                >
                  Product Name
                </label>

                <input
                  id="new-product-name"
                  name="name"
                  type="text"
                  value={editingProduct?.name || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label
                  htmlFor="new-product-price"
                  className="block text-sm font-semibold mb-2"
                >
                  Price
                </label>

                <input
                  id="new-product-price"
                  name="price"
                  type="text"
                  value={editingProduct?.price || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label
                  htmlFor="new-product-category"
                  className="block text-sm font-semibold mb-2"
                >
                  Category
                </label>

                <input
                  id="new-product-category"
                  name="category"
                  type="text"
                  value={editingProduct?.category || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label
                  htmlFor="new-product-brand"
                  className="block text-sm font-semibold mb-2"
                >
                  Brand
                </label>

                <input
                  id="new-product-brand"
                  name="brand"
                  type="text"
                  value={editingProduct?.brand || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      brand: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Product Type
                </label>

                <input
                  type="text"
                  value={editingProduct?.type || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      type: e.target.value,
                    })
                  }
                  placeholder="e.g. Gaming Laptop"
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Rating
                </label>

                <select
                  value={editingProduct?.rating || 5}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      rating: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded-xl p-3"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Badge
                </label>

                <input
                  type="text"
                  value={editingProduct?.badge || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      badge: e.target.value,
                    })
                  }
                  placeholder="e.g. New, Best Seller, Premium (optional)"
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="new-product-image"
                  className="block text-sm font-semibold mb-2"
                >
                  Product Image
                </label>

                <input
                  id="new-product-image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageUpload}
                  className="w-full border rounded-xl p-3"
                />

                {editingProduct?.image && (
                  <div className="mt-6 flex justify-center">
                    <img
                      src={getProductImage(editingProduct)}
                      alt="Preview"
                      className="w-40 h-40 object-contain border rounded-2xl shadow-lg"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 mt-8 md:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    setEditProductImageFile(null);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add Product Modal */}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-8 relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 pr-10">
              Add New Product
            </h2>

            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-2xl text-gray-500 hover:text-red-500"
            >
              ✕
            </button>

            <div className="grid md:grid-cols-2 gap-5 mt-8">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Product Name
                </label>

                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      name: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Price
                </label>

                <input
                  type="text"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Category
                </label>

                <select
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      category: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl p-3"
                >
                  <option value="">Select Category</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Desktop Computers">Desktop Computers</option>
                  <option value="Monitors">Monitors</option>
                  <option value="Keyboards">Keyboards</option>
                  <option value="Mice">Mice</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Brand
                </label>

                <select
                  value={newProduct.brand}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      brand: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl p-3"
                >
                  <option value="">Select Brand</option>
                  <option value="HP">HP</option>
                  <option value="Dell">Dell</option>
                  <option value="Lenovo">Lenovo</option>
                  <option value="ASUS">ASUS</option>
                  <option value="Acer">Acer</option>
                  <option value="Apple">Apple</option>
                  <option value="Logitech">Logitech</option>
                  <option value="MSI">MSI</option>
                  <option value="Samsung">Samsung</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Product Type
                </label>

                <input
                  type="text"
                  value={newProduct.type}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      type: e.target.value,
                    })
                  }
                  placeholder="e.g. Gaming Laptop"
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Rating
                </label>

                <select
                  value={newProduct.rating}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      rating: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded-xl p-3"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Badge
                </label>

                <input
                  type="text"
                  value={newProduct.badge}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      badge: e.target.value,
                    })
                  }
                  placeholder="e.g. New, Best Seller, Premium (optional)"
                  className="w-full border rounded-xl p-3"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Product Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full border rounded-xl p-3"
                />

                {newProduct.image && (
                  <div className="mt-6 flex justify-center">
                    <img
                      src={newProduct.image}
                      alt="Preview"
                      className="w-40 h-40 object-contain border rounded-2xl shadow-lg"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 mt-8 md:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewProductImageFile(null);

                    setNewProduct({
                      name: "",
                      category: "",
                      brand: "",
                      type: "",
                      price: "",
                      image: "",
                      rating: 5,
                      badge: "",
                    });
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminProducts;
