import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin({ refreshProducts }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [notificationCount, setNotificationCount] = useState(() => Number(localStorage.getItem("admin_new_order_count") || 0));
  const lastOrderCountRef = useRef(Number(localStorage.getItem("admin_last_order_count") || 0));

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

  useEffect(() => {
    let isActive = true;

    const checkNewOrders = async () => {
      try {
        const res = await fetch("http://localhost:8002/get_all_orders.php");
        const data = await res.json();

        if (!isActive || !data?.success) return;

        const currentCount = Array.isArray(data.orders) ? data.orders.length : 0;

        if (currentCount > lastOrderCountRef.current) {
          const diff = currentCount - lastOrderCountRef.current;
          setNotificationCount((prev) => {
            const next = prev + diff;
            localStorage.setItem("admin_new_order_count", String(next));
            return next;
          });
        }

        lastOrderCountRef.current = currentCount;
        localStorage.setItem("admin_last_order_count", String(currentCount));
      } catch (error) {
        console.error("Admin notification check failed:", error);
      }
    };

    checkNewOrders();
    const interval = window.setInterval(checkNewOrders, 5000);

    return () => {
      isActive = false;
      window.clearInterval(interval);
    };
  }, []);

  const handleOpenOrders = () => {
    setNotificationCount(0);
    localStorage.setItem("admin_new_order_count", "0");
    navigate("/orders");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel 🔥</h1>
          <h2 className="text-lg text-gray-500">Products 📦</h2>
        </div>

        <button
          onClick={handleOpenOrders}
          className="relative flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <span className="text-lg">🔔</span>
          Notifications
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {notificationCount}
            </span>
          )}
        </button>
      </div>

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