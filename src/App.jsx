
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import ForgotPassword from "./pages/ForgotPassword";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Stock from "./pages/Stock";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import ResetPassword from "./pages/ResetPassword";

import ProtectedAdmin from "./components/ProtectedAdmin";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";

import Chatbot from "./components/Chatbot";

import staticProducts from "./data/products";

import AdminSettings from "./pages/admin/AdminSettings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

function App() {
  // =========================
  // CART
  // =========================
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  // =========================
  // PRODUCTS
  // =========================
  const [products, setProducts] = useState([]);

  // =========================
  // WISHLIST
  // =========================
  const [wishlist, setWishlist] = useState([]);

  // =========================
  // LOAD PRODUCTS
  // =========================
  const refreshProducts = () => {
    try {
      const savedProducts =
        JSON.parse(localStorage.getItem("products")) || [];

      setProducts([
        ...staticProducts,
        ...savedProducts,
      ]);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts(staticProducts);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  // =========================
  // LOAD WISHLIST
  // =========================
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wishlist");

      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
      setWishlist([]);
    }
  }, []);

  // =========================
  // SAVE WISHLIST
  // =========================
  useEffect(() => {
    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  // =========================
  // SAVE CART
  // =========================
  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  // =========================
  // TOGGLE WISHLIST
  // =========================
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some(
        (item) => item.id === product.id
      );

      if (exists) {
        return prev.filter(
          (item) => item.id !== product.id
        );
      }

      return [...prev, product];
    });
  };

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  (item.quantity || 1) + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // =========================
  // REMOVE FROM CART
  // =========================
  const removeFromCart = (id) => {
    setCart((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // =========================
  // INCREASE QUANTITY
  // =========================
  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                (item.quantity || 1) + 1,
            }
          : item
      )
    );
  };

  // =========================
  // DECREASE QUANTITY
  // =========================
  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
    );
  };

  // =========================
  // RENDER
  // =========================
  return (
    <>
      <Routes>

        {/* =========================
            FORGOT PASSWORD
        ========================= */}

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* =========================
            HOME
        ========================= */}

        <Route
          path="/"
          element={
            <>
              <Navbar
                cartCount={cart.reduce(
                  (sum, item) =>
                    sum +
                    Number(item.quantity || 0),
                  0
                )}
                wishlistCount={wishlist.length}
              />

              <Home
                products={products}
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
                wishlist={wishlist}
              />
            </>
          }
        />

        {/* =========================
            LOGIN
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =========================
            REGISTER
        ========================= */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================
            CART
        ========================= */}

        <Route
          path="/cart"
          element={
            <>
              <Navbar
                cartCount={cart.reduce(
                  (sum, item) =>
                    sum +
                    Number(item.quantity || 0),
                  0
                )}
                wishlistCount={wishlist.length}
              />

              <Cart
                cart={cart}
                removeFromCart={removeFromCart}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
              />
            </>
          }
        />

        {/* =========================
            CHECKOUT
        ========================= */}

        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              setCart={setCart}
            />
          }
        />

        {/* =========================
            RESET PASSWORD
        ========================= */}

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* =========================
            WISHLIST
        ========================= */}

        <Route
          path="/wishlist"
          element={
            <>
              <Navbar
                cartCount={cart.reduce(
                  (sum, item) =>
                    sum +
                    Number(item.quantity || 0),
                  0
                )}
                wishlistCount={wishlist.length}
              />

              <Wishlist
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            </>
          }
        />

        {/* =========================
            PRODUCT DETAILS
        ========================= */}

        <Route
          path="/product/:id"
          element={
            <>
              <Navbar
                cartCount={cart.reduce(
                  (sum, item) =>
                    sum +
                    Number(item.quantity || 0),
                  0
                )}
                wishlistCount={wishlist.length}
              />

              <ProductDetails
                products={products}
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
                wishlist={wishlist}
              />
            </>
          }
        />

        {/* =========================
            PROFILE
        ========================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <>
                <Navbar
                  cartCount={cart.reduce(
                    (sum, item) =>
                      sum +
                      Number(item.quantity || 0),
                    0
                  )}
                  wishlistCount={wishlist.length}
                />

                <Profile />
              </>
            </ProtectedRoute>
          }
        />

        {/* =========================
            ORDERS
        ========================= */}

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <>
                <Navbar
                  cartCount={cart.reduce(
                    (sum, item) =>
                      sum +
                      Number(item.quantity || 0),
                    0
                  )}
                  wishlistCount={wishlist.length}
                />

                <Orders />
              </>
            </ProtectedRoute>
          }
        />

        {/* =========================
            ADMIN PANEL
        ========================= */}

        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminLayout />
            </ProtectedAdmin>
          }
        >

          {/* Dashboard */}
          <Route
            index
            element={<AdminDashboard />}
          />

          {/* Products */}
          <Route
            path="products"
            element={
              <AdminProducts
                products={products}
                refreshProducts={refreshProducts}
              />
            }
          />

          {/* Stock */}
          <Route
            path="stock"
            element={
              <Stock products={products} />
            }
          />

          {/* Orders */}
          <Route
            path="orders"
            element={<Orders />}
          />

          {/* Users */}
          <Route
            path="users"
            element={<AdminUsers />}
          />

          {/* Analytics */}
          <Route
            path="analytics"
            element={<AdminAnalytics />}
          />

          {/* Settings */}
          <Route
            path="settings"
            element={<AdminSettings />}
          />

        </Route>

      </Routes>

      {/* =========================
          🤖 CHATBOT
      ========================= */}

      <Chatbot />

    </>
  );
}

export default App;
