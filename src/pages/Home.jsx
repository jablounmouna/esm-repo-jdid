import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

/* Small inline icons — avoids emoji, keeps the UI feeling designed rather than decorated */
const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "#c8973f" : "none"}
    stroke={filled ? "#c8973f" : "#1a1a1a"}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);

const BagIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

function Home({ products, addToCart, toggleWishlist, wishlist }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { i18n } = useTranslation();

  const getProductName = (product) => {
    if (typeof product.name === "object") {
      return product.name[i18n.language] || product.name.en;
    }
    return product.name;
  };

  const filteredProducts = products.filter((product) => {
    const name = getProductName(product);
    return name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="site-container">
      {/* HEADER */}
      <div style={{textAlign:'center', marginBottom:24}}>
        <span style={{fontSize:11, textTransform:'uppercase', letterSpacing:'0.3em', color:'var(--color-accent)', fontWeight:600}}>Catalogue</span>
        <h1 className="font-display" style={{fontSize:28, color:'var(--color-ink)', marginTop:8}}>Our Products</h1>
        <div style={{width:56, height:1, backgroundColor:'var(--color-accent)', margin:'12px auto 0'}} />
      </div>

      {/* SEARCH */}
      <div style={{display:'flex', justifyContent:'center', marginBottom:28}}>
        <div style={{width:'100%', maxWidth:520}}>
          <span style={{position:'absolute', marginLeft:12, marginTop:12, color:'var(--color-ink-soft)'}}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search"
            style={{paddingLeft:44}}
          />
        </div>
      </div>

      {/* PRODUCTS */}
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const isInWishlist = wishlist.some((item) => item.id === product.id);
            const name = getProductName(product);
            return (
              <div key={product.id} className="product-card">
                <div style={{position:'relative'}}>
                  <img
                    src={product.image}
                    alt={name}
                    className="product-img"
                    onError={(e)=>{e.target.onerror=null; e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23f1efe9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="%23969">Image unavailable</text></svg>'}}
                  />

                  <button onClick={() => toggleWishlist(product)} aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"} className="wishlist-btn">
                    <HeartIcon filled={isInWishlist} />
                  </button>
                </div>

                <div className="product-info">
                  <div className="product-title">{name}</div>
                  <span className="product-price">{product.price} TND</span>

                  <div style={{display:'flex', gap:10, flexWrap:'wrap', marginTop:12}}>
                    <button onClick={() => addToCart(product)} className="btn btn-primary card-cta" style={{width:'auto', backgroundColor:'var(--color-primary)', color:'#fff'}}>
                      <BagIcon />
                      Add to cart
                    </button>
                    <button onClick={() => {
                      addToCart(product);
                      navigate("/checkout", { state: { product } });
                    }} className="btn btn-outline" style={{width:'auto', color:'#111', borderColor:'#111'}}>
                      Buy now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center mt-16">
          <p className="font-display italic text-xl text-[#6b6b63]">
            No products match your search.
          </p>
          <p className="text-sm text-[#a9a49a] mt-2">
            Try a different keyword or clear the search field.
          </p>
        </div>
      )}
    </div>
  );
}

export default Home;