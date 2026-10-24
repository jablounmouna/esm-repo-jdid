import { NavLink, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      isActive
        ? "bg-black text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-0 bottom-0 p-5">

        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            Admin Panel
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Handmade Shop
          </p>
        </div>

        <nav className="space-y-2">

          <NavLink to="/admin" end className={linkClass}>
            🏠 <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/products" className={linkClass}>
            🛍️ <span>Products</span>
          </NavLink>

          <NavLink to="/admin/stock" className={linkClass}>
            📦 <span>Stock</span>
          </NavLink>

          <NavLink to="/admin/orders" className={linkClass}>
            🛒 <span>Orders</span>
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            👥 <span>Customers</span>
          </NavLink>

          <NavLink to="/admin/analytics" className={linkClass}>
            📊 <span>Analytics</span>
          </NavLink>

          <NavLink to="/admin/settings" className={linkClass}>
            ⚙️ <span>Settings</span>
          </NavLink>

        </nav>

        <div className="absolute bottom-5 left-5 right-5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
          >
            🚪 <span>Logout</span>
          </button>
        </div>

      </aside>

      <main className="ml-64 flex-1 min-h-screen">
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;
