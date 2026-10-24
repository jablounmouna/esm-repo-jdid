import { useEffect, useState } from "react";

function ProductCard({ product, addToCart, toggleWishlist, wishlist }) {
  const isInWishlist =
    Array.isArray(wishlist) &&
    wishlist.some((item) => item.id === product.id);

  // Read inventory managed by Admin Stock
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem("inventory");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Update when localStorage inventory changes
  useEffect(() => {
    const updateInventory = () => {
      try {
        const saved = localStorage.getItem("inventory");
        setInventory(saved ? JSON.parse(saved) : {});
      } catch {
        setInventory({});
      }
    };

    window.addEventListener("storage", updateInventory);

    // Also check periodically for changes in the same tab
    const interval = setInterval(updateInventory, 500);

    return () => {
      window.removeEventListener("storage", updateInventory);
      clearInterval(interval);
    };
  }, []);

  // Admin Stock quantity has priority
  const stock = Number(
    inventory[Number(product.id)]?.quantity ??
      product.stock ??
      0
  );

  const isOut = stock <= 0;

  return (
    <div className="product-card">

      {/* IMAGE */}
      <div style={{ position: "relative" }}>
        <img
          className="product-img"
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='%23f1efe9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23969'>Image unavailable</text></svg>";
          }}
        />

        {/* STOCK BADGE */}
        <span
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            padding: "6px 12px",
            borderRadius: "20px",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "600",
            backgroundColor: isOut ? "#dc2626" : "#16a34a",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            zIndex: 2,
          }}
        >
          {isOut ? "Rupture de stock" : "En stock"}
        </span>

        {/* WISHLIST */}
        <button
          className={`wishlist-btn ${isInWishlist ? "active" : ""}`}
          onClick={() => toggleWishlist(product)}
          aria-label="toggle wishlist"
        >
          {isInWishlist ? "❤️" : "🤍"}
        </button>
      </div>

      {/* PRODUCT INFO */}
      <div className="product-info">
        <div className="product-title">{product.name}</div>

        {product.description && (
          <div className="product-desc">
            {product.description}
          </div>
        )}

        <div
          className="row"
          style={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="product-price">
            {product.price} TND
          </div>

          <div className="muted">
            Stock: {stock}
          </div>
        </div>

        {isOut ? (
          <div
            className="muted"
            style={{
              marginTop: 10,
              color: "#dc2626",
              fontWeight: "600",
            }}
          >
            Out of stock ❌
          </div>
        ) : (
          <button
            className="btn btn-primary card-cta"
            onClick={() => addToCart(product)}
          >
            Add to cart 🛒
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;