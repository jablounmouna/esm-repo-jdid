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
    <nav className="navbar">

      {/* Logo / Brand */}
      <Link to="/" className="brand">
        <span style={{fontWeight:700, fontSize:20}}>Kelibia Net</span>
      </Link>

      <div className="nav-actions">

        {/* Language */}
        <div className="flex" style={{gap:8}}>
          <button onClick={() => i18n.changeLanguage("en")} className="btn btn-sm btn-ghost">EN</button>
          <button onClick={() => i18n.changeLanguage("fr")} className="btn btn-sm btn-ghost">FR</button>
          <button onClick={() => i18n.changeLanguage("ar")} className="btn btn-sm btn-ghost">AR</button>
        </div>

        {/* Wishlist */}
        <Link to="/wishlist" className="relative" aria-label="wishlist">
          <div className="center" style={{width:36,height:36}} aria-hidden>❤️</div>
          {wishlistCount > 0 && (
            <span className="badge" style={{position:'absolute', top:-8, right:-8}}>{wishlistCount}</span>
          )}
        </Link>

        {/* Cart */}
        <Link to="/cart" className="relative" aria-label="cart">
          <div className="center" style={{width:36,height:36}} aria-hidden>🛒</div>
          {cartCount > 0 && (
            <span className="badge" style={{position:'absolute', top:-8, right:-8, background:'#111', color:'#fff'}}>{cartCount}</span>
          )}
        </Link>

        {/* Home */}
        <Link to="/" className="muted">{t("home")}</Link>

        {/* Auth */}
        {!user ? (
          <>
            <Link to="/login" className="muted">{t("login")}</Link>

            <Link to="/register" className="btn btn-primary">{t("register")}</Link>
          </>
        ) : (
          <>
            <span className="muted">👋 {user.name}</span>

            <Link to="/profile" className="muted">{t("profile")}</Link>

            {user.role === "admin" && (
              <>
                <Link to="/admin" className="muted">Admin</Link>
                <Link to="/orders" className="muted">Orders</Link>
              </>
            )}

            <button onClick={logout} className="btn btn-ghost">{t("logout")}</button>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;