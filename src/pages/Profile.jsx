import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:8002/get_orders.php?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setOrders(data.orders || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("ORDERS ERROR:", err);
        setLoading(false);
      });
  }, [navigate, user]);

  if (!user) return null;

  if (loading) {
    return <h2 className="muted" style={{ textAlign: "center", marginTop: 24 }}>Loading orders...</h2>;
  }

  return (
    <div className="site-container">
      <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700 }}>My Profile 👤</h1>

      <p className="muted" style={{ marginTop: 10 }}>Email: {user.email}</p>

      <h2 className="font-display" style={{ fontSize: 20, marginTop: 24, marginBottom: 12 }}>My Orders 📦</h2>

      {orders.length === 0 ? (
        <p className="muted">No orders yet 🛒</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="panel" style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Order #{order.id}</h3>
            <p>💰 Total: {order.total} TND</p>
            <p>📍 Address: {order.address}</p>
            <p>📞 Phone: {order.phone || "No phone"}</p>
            <p>📦 Status: {order.status}</p>
            <p>📅 Date: {order.created_at}</p>

            {order.products && order.products.length > 0 && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #eee" }}>
                <p style={{ fontWeight: 700, marginBottom: 6 }}>Items purchased:</p>
                {order.products.map((item, index) => (
                  <div key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span>{item.name || "Product"} × {item.quantity}</span>
                    <span>{Number(item.price || 0).toFixed(2)} TND</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}


export default Profile;