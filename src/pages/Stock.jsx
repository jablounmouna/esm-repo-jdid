import { useEffect, useState } from "react";

function Stock({ products = [] }) {
  const [inventory, setInventory] = useState({});

  // =========================
  // LOAD INVENTORY
  // =========================
  useEffect(() => {
    try {
      const saved = localStorage.getItem("inventory");

      if (saved) {
        setInventory(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Invalid inventory data:", error);
      localStorage.removeItem("inventory");
      setInventory({});
    }
  }, []);

  // =========================
  // UPDATE QUANTITY
  // =========================
  const updateQuantity = async (productId, delta) => {
    try {
      const saved = localStorage.getItem("inventory");
      const currentInventory = saved
        ? JSON.parse(saved)
        : {};

      const current = currentInventory[productId] || {
        quantity: 0,
        lowStockThreshold: 5,
      };

      const currentQuantity =
        Number(current.quantity) || 0;

      const newQuantity = Math.max(
        0,
        currentQuantity + Number(delta)
      );

      const updatedProduct = {
        ...current,
        quantity: newQuantity,
      };

      const updatedInventory = {
        ...currentInventory,
        [productId]: updatedProduct,
      };

      // =========================
      // UPDATE REACT
      // =========================
      setInventory(updatedInventory);

      // =========================
      // SAVE LOCALSTORAGE
      // =========================
      localStorage.setItem(
        "inventory",
        JSON.stringify(updatedInventory)
      );

      // =========================
      // SAVE PHP / MYSQL
      // =========================
      const response = await fetch(
        "http://localhost:8002/api/update_inventory.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: Number(productId),
            quantity: newQuantity,
            low_stock_threshold:
              Number(current.lowStockThreshold) || 5,
          }),
        }
      );

      const result = await response.json();

      console.log("Server response:", result);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update inventory"
        );
      }

      console.log(
        `Stock: ${currentQuantity} → ${newQuantity}`
      );

    } catch (error) {
      console.error(
        "Error updating quantity:",
        error
      );
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Stock
      </h1>

      <div className="space-y-4">

        {products.map((product) => {
          const productId = product.id;

          const stock =
            inventory[productId] || {
              quantity: 0,
              lowStockThreshold: 5,
            };

          const quantity =
            Number(stock.quantity) || 0;

          const threshold =
            Number(stock.lowStockThreshold) || 5;

          const isLowStock =
            quantity <= threshold;

          return (
            <div
              key={productId}
              className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between"
            >

              <div>
                <h2 className="font-semibold text-lg">
                  {typeof product.name === "object"
                    ? product.name.en ||
                      Object.values(product.name)[0]
                    : product.name}
                </h2>

                <p className="text-gray-500">
                  Product ID: {productId}
                </p>

                <p
                  className={
                    isLowStock
                      ? "text-red-600 font-semibold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {isLowStock
                    ? "⚠️ Low Stock"
                    : "✓ In Stock"}
                </p>
              </div>

              <div className="flex items-center gap-4">

                <button
                  onClick={() =>
                    updateQuantity(productId, -1)
                  }
                  disabled={quantity === 0}
                  className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
                >
                  -
                </button>

                <span className="text-xl font-bold min-w-[40px] text-center">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    updateQuantity(productId, 1)
                  }
                  className="w-10 h-10 rounded-lg bg-black text-white hover:bg-gray-800"
                >
                  +
                </button>

              </div>

            </div>
          );
        })}

        {products.length === 0 && (
          <p className="text-gray-500">
            No products found.
          </p>
        )}

      </div>

    </div>
  );
}

export default Stock;