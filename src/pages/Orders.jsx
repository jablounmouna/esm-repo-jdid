import { useState, useRef, useEffect } from "react";
import { apiFetch } from "../api";

function Orders() {

  const [orders, setOrders] = useState([]);
  const printRefs = useRef([]);

  // ✅ Get all orders
  useEffect(() => {

    apiFetch("/get_all_orders.php")
      .then((data) => {

        console.log("ORDERS:", data);

        if (data.success) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }

      })
      .catch((error) => {
        console.log("Orders error:", error);
      });

  }, []);


  // ✅ Update status
  const updateStatus = async (index, status) => {

    const order = orders[index];

    try {

      const data = await apiFetch("/get_all_orders.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: order.id,
          status: status
        })
      });

      if (data.success) {

        const updatedOrders = orders.map((item, i) =>
          i === index
            ? { ...item, status: status }
            : item
        );

        setOrders(updatedOrders);

      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log(error);
      alert("Update error ❌");
    }

  };


  // ✅ Print
  const handlePrint = (index) => {

    const printContent = printRefs.current[index];

    if (!printContent) return;

    const win = window.open("", "", "width=800,height=600");

    win.document.write(`
      <html>
      <head>
        <title>Facture</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          img { width: 60px; height: 60px; object-fit: cover; }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `);

    win.document.close();

    setTimeout(() => {
      win.print();
      win.close();
    }, 500);

  };


  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Orders 📦
      </h1>

      {orders.length === 0 ? (

        <h2 className="text-gray-500 text-center mt-10">
          No orders yet
        </h2>

      ) : (

        <div className="flex flex-col gap-6">

          {orders.map((order, index) => (

            <div
              key={order.id || index}
              ref={(el) => (printRefs.current[index] = el)}
              className="bg-white shadow-md rounded-xl p-6"
            >

              <h2 className="text-xl font-bold">
                Customer: {order.name || "Unknown"}
              </h2>

              <p>Email: {order.email || "No email"}</p>
              <p>Address: {order.address || "No address"}</p>

              <p>
                Phone:{" "}
                {order.phone ? (
                  <a href={`tel:${order.phone}`} className="text-blue-600">
                    {order.phone}
                  </a>
                ) : "No phone"}
              </p>

              <p>Total: {order.total} TND</p>

              <p>
                Status:{" "}
                <span className="font-semibold">{order.status}</span>
              </p>

              {/* ✅ PRODUCTS */}
              <div className="mt-4">

                <h3 className="font-bold mb-2">Products:</h3>

                {order.products && order.products.length > 0 ? (

                  order.products.map((product, i) => (

                    <div
                      key={i}
                      className="flex items-center gap-4 border p-3 rounded mb-2"
                    >

                      <img
                        src={
                          product.image
                            ? product.image.startsWith("http")
                              ? product.image
                              : `/${product.image}`
                            : "https://placehold.co/80x80"
                        }
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded"
                      />

                      <div>
                        <p className="font-semibold">
                          {product.name}
                        </p>

                        <p>Price: {product.price} TND</p>
                        <p>Qty: {product.quantity}</p>
                      </div>

                    </div>

                  ))

                ) : (

                  <p className="text-gray-500">
                    No products
                  </p>

                )}

              </div>

              {/* ✅ ACTIONS */}
              <div className="flex gap-3 mt-4">

                <button
                  onClick={() => updateStatus(index, "Confirmed")}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Confirm
                </button>

                <button
                  onClick={() => updateStatus(index, "Cancelled")}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handlePrint(index)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Print
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default Orders;