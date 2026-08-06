import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import ForgotPassword from "./pages/ForgotPassword";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import ResetPassword from "./pages/ResetPassword";
import ProtectedAdmin from "./components/ProtectedAdmin";
import ProtectedRoute from "./components/ProtectedRoute";

import staticProducts from "./data/products";

function App() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // 🧠 load products
  const refreshProducts = () => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts([...staticProducts, ...savedProducts]);
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  // ❤️ load wishlist
  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  // 💾 save wishlist
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // 💾 save cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ❤️ toggle (SAFE version)
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);

      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // 🛒 CART (SAFE version)
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);

      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  return (
    <>
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}
        wishlistCount={wishlist.length} // ❤️ مهم
      />

      <Routes>
        <Route 
 path="/forgot-password" 
 element={<ForgotPassword />} 
/>
        <Route
          path="/"
          element={
            <Home
              products={products}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              wishlist={wishlist}
            />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
            />
          }
        />

        <Route
          path="/checkout"
          element={<Checkout cart={cart} setCart={setCart} />}
        />
        <Route 
 path="/reset-password" 
 element={<ResetPassword />}
/>

        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlist={wishlist}
              toggleWishlist={toggleWishlist} // 🔥 باش تنجم تنحي items
            />
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProductDetails
              products={products}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              wishlist={wishlist}
            />
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedAdmin>
              <Orders />
            </ProtectedAdmin>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <Admin refreshProducts={refreshProducts} />
            </ProtectedAdmin>
          }
        />
      </Routes>
    </>
  );
}

export default App;