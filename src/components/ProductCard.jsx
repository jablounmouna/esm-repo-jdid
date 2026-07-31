function ProductCard({ product, addToCart, toggleWishlist, wishlist }) {
  const isInWishlist = wishlist.some(item => item.id === product.id);
  const isOut = product.stock === 0;

  return (
    <div className="card">
      
      {/* ❤️ الصورة + زر القلب */}
      <div className="img-container">
        <img src={product.image} alt={product.name} />

        <button
          className={`wishlist-btn ${isInWishlist ? "active" : ""}`}
          onClick={() => toggleWishlist(product)}
        >
          {isInWishlist ? "❤️" : "🤍"}
        </button>
      </div>

      <h3>{product.name}</h3>
      <p>{product.price} TND</p>

      <p>Stock: {product.stock}</p>

      {isOut ? (
        <p style={{ color: "red" }}>Out of stock ❌</p>
      ) : (
        <button onClick={() => addToCart(product)}>
          Add to cart 🛒
        </button>
      )}
    </div>
  );
}

export default ProductCard;