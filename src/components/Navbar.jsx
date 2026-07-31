import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function Navbar({ cartCount = 0, wishlistCount = 0 }) {

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const updateUser = () => {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      setUser(savedUser);
    };

    updateUser();

    // يسمع لأي تغيير في localStorage
    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">

      {/* Logo */}
      <Link to="/" className="font-bold text-xl">
        Handmade Shop 🛍️
      </Link>

      <div className="flex items-center gap-6">

        {/* Language */}
        <div className="flex gap-2">
          <button onClick={() => i18n.changeLanguage("en")} className="text-sm">EN</button>
          <button onClick={() => i18n.changeLanguage("fr")} className="text-sm">FR</button>
          <button onClick={() => i18n.changeLanguage("ar")} className="text-sm">AR</button>
        </div>

        {/* Wishlist */}
        <Link to="/wishlist" className="relative">
          ❤️
          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 rounded-full">
              {wishlistCount}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link to="/cart" className="relative">
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-black text-white text-xs px-2 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Home */}
        <Link to="/" className="text-gray-600 hover:text-black">
          {t("home")}
        </Link>

        {/* Auth حالة */}
        {!user ? (
          <>
            <Link to="/login" className="text-gray-600 hover:text-black">
              {t("login")}
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              {t("register")}
            </Link>
          </>
        ) : (
          <>
            {/* User name */}
            <span className="text-sm text-gray-700">
              👋 {user.name}
            </span>

            <Link to="/profile" className="text-gray-600 hover:text-black">
              {t("profile")}
            </Link>

            {/* Admin */}
            {user.role === "admin" && (
              <>
                <Link to="/admin" className="text-gray-600 hover:text-black">
                  Admin 🔥
                </Link>

                <Link to="/orders" className="text-gray-600 hover:text-black">
                  Orders 📦
                </Link>
              </>
            )}

            {/* Logout */}
            <button
              onClick={logout}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              {t("logout")}
            </button>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;