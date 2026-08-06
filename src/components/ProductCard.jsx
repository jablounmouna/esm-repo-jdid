function ProductCard({ product, addToCart, toggleWishlist, wishlist }) {
  const isInWishlist = Array.isArray(wishlist) && wishlist.some(item => item.id === product.id);
  const isOut = product.stock === 0;

  return (
    <div className="product-card">
      <div style={{position:'relative'}}>
        <img
          className="product-img"
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23f1efe9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="%23969">Image unavailable</text></svg>';
          }}
        />

        <button
          className={`wishlist-btn ${isInWishlist ? "active" : ""}`}
          onClick={() => toggleWishlist(product)}
          aria-label="toggle wishlist"
        >
          {isInWishlist ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="product-info">
        <div className="product-title">{product.name}</div>
        {product.description && <div className="product-desc">{product.description}</div>}

        <div className="row" style={{alignItems:'center', justifyContent:'space-between'}}>
          <div className="product-price">{product.price} TND</div>
          <div className="muted">Stock: {product.stock}</div>
        </div>

        {isOut ? (
          <div className="muted" style={{marginTop:10, color:'#c43'}}>Out of stock ❌</div>
        ) : (
          <button className="btn btn-primary card-cta" onClick={() => addToCart(product)}>Add to cart 🛒</button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;