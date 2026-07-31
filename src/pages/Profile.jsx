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

    // 🔥 Fetch orders from backend
    fetch(`http://127.0.0.1:8001/api/get_orders.php?email=${user.email}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

  }, [user, navigate]);

  if (!user) return <p>Redirecting...</p>;
  if (loading) return <p>Loading orders...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Profile 👤</h1>
      <h2>Email: {user.email}</h2>
      <h2>My Orders 📦</h2>

      {orders.length === 0 ? (
        <p>No orders yet 🛒</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} style={{
            background: "white",
            padding: "20px",
            margin: "20px",
            borderRadius: "15px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
          }}>
            <h3>Order #{index + 1}</h3>
            <p>Total: {order.total} TND</p>
            <p>Status: {order.status || "Pending ⏳"}</p>
            <p>Date: {order.date}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Profile;