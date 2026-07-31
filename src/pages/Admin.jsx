import { useState } from "react";

function Admin({ refreshProducts }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const customProducts = JSON.parse(localStorage.getItem("products")) || [];

  const addProduct = () => {
    if (!name || !price || !image) {
      alert("Fill all fields ❌");
      return;
    }

    if (isNaN(Number(price))) {
      alert("Price must be a number only, like 2 or 25.5 — no letters or symbols ❌");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name,
      price: Number(price),
      image
    };

    const updated = [...customProducts, newProduct];
    localStorage.setItem("products", JSON.stringify(updated));

    refreshProducts();

    alert("Product added ✅");
    setName("");
    setPrice("");
    setImage("");
  };

  const deleteProduct = (id) => {
    const updated = customProducts.filter((item) => item.id !== id);
    localStorage.setItem("products", JSON.stringify(updated));
    refreshProducts();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel 🔥</h1>
      <h2 className="text-lg text-gray-500 mb-8">Products 📦</h2>

      {/* Add product form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Add a new product
        </h3>

       <div className="flex flex-col sm:flex-row gap-4">
  <input
    placeholder="Product name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full sm:flex-1 sm:min-w-[160px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
  />

  <input
    placeholder="Price"
    type="number"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
    className="w-full sm:flex-1 sm:min-w-[120px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
  />

  <input
    placeholder="Image URL"
    value={image}
    onChange={(e) => setImage(e.target.value)}
    className="w-full sm:flex-1 sm:min-w-[160px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
  />

  <button
    onClick={addProduct}
    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition whitespace-nowrap shrink-0"
  >
    Add Product
  </button>
</div>
      </div>

      {/* Product list */}
      {customProducts.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No custom products added yet
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {customProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            >
<img
  src={product.image}
  alt={product.name}
  className="w-full h-40 object-cover"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/400x400?text=No+Image";
  }}
/>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-500 mt-1">{product.price} TND</p>

                <button
                  onClick={() => deleteProduct(product.id)}
                  className="mt-auto pt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;