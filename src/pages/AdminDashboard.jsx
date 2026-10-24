function AdminDashboard() {
  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome back, Admin 👋
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-gray-500 text-sm">
            Total Revenue
          </p>

          <h2 className="text-3xl font-bold mt-2">
            0 TND
          </h2>

          <p className="text-green-600 text-sm mt-2">
            ↗ 0% this month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-gray-500 text-sm">
            Orders
          </p>

          <h2 className="text-3xl font-bold mt-2">
            0
          </h2>

          <p className="text-blue-600 text-sm mt-2">
            🛒 Total orders
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-gray-500 text-sm">
            Products
          </p>

          <h2 className="text-3xl font-bold mt-2">
            0
          </h2>

          <p className="text-purple-600 text-sm mt-2">
            🛍️ Active products
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-gray-500 text-sm">
            Customers
          </p>

          <h2 className="text-3xl font-bold mt-2">
            0
          </h2>

          <p className="text-orange-600 text-sm mt-2">
            👥 Registered users
          </p>
        </div>

      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        {/* RECENT ORDERS */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-bold">
              Recent Orders
            </h2>

            <button className="text-sm text-blue-600 hover:underline">
              View all
            </button>

          </div>

          <div className="text-center py-12 text-gray-400">
            No orders yet
          </div>

        </div>

        {/* LOW STOCK */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-bold">
              Low Stock
            </h2>

            <button className="text-sm text-blue-600 hover:underline">
              View stock
            </button>

          </div>

          <div className="text-center py-12 text-gray-400">
            No low stock products
          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;