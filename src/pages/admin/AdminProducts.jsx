import { useState } from "react";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price || !form.category.trim()) {
      alert("Please fill in Name, Price and Category.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8002/api/add_product.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            price: Number(form.price),
            category: form.category.trim(),
            description: form.description.trim(),
            stock: Number(form.stock) || 0,
            image: form.image.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      console.log("ADD PRODUCT:", data);

      if (!data.success) {
        alert(data.message || "Failed to add product.");
        return;
      }

      const newProduct = {
        id: data.id,
        name: form.name.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        description: form.description.trim(),
        stock: Number(form.stock) || 0,
        image: form.image.trim(),
      };

      setProducts((prev) => [...prev, newProduct]);

      setForm({
        name: "",
        price: "",
        category: "",
        description: "",
        stock: "",
        image: "",
      });

      setShowForm(false);

      alert("Product added successfully ✅");
    } catch (error) {
      console.error("ADD PRODUCT ERROR:", error);

      alert(
        "Cannot connect to the PHP backend on port 8002."
      );
    }
  };

  const handleDelete = (id) => {
    setProducts((prev) =>
      prev.filter((product) => product.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Products
          </h1>

          <p className="mt-2 text-gray-500">
            Product management
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800"
        >
          + Add Product
        </button>
      </div>

      {/* ADD PRODUCT FORM */}
      {showForm && (
        <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">
            Add New Product
          </h2>

          <form onSubmit={handleAddProduct}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Product Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: Gaming PC"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* PRICE */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Price *
                </label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="2500"
                  min="0"
                  step="0.01"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category *
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">
                    Select category
                  </option>

                  <option value="PC">
                    PC
                  </option>

                  <option value="Laptop">
                    Laptop
                  </option>

                  <option value="Accessories">
                    Accessories
                  </option>

                  <option value="Gaming">
                    Gaming
                  </option>

                  <option value="Components">
                    Components
                  </option>
                </select>
              </div>

              {/* STOCK */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* IMAGE */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your product..."
                  rows="4"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border px-5 py-3 transition hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PRODUCTS LIST */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">
            All Products
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">
              No products yet
            </p>

            <p className="mt-2 text-sm">
              Click "Add Product" to create your first product.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-5 p-6"
              >
                {/* IMAGE */}
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {product.category}
                  </p>

                  <p className="mt-1 text-sm">
                    Stock: {product.stock}
                  </p>
                </div>

                {/* PRICE */}
                <div className="font-bold">
                  {product.price} DT
                </div>

                {/* DELETE */}
                <button
                  type="button"
                  onClick={() => handleDelete(product.id)}
                  className="px-3 text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;