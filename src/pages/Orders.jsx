import { useState } from "react";

function Orders() {

  const [orders, setOrders] = useState(
    JSON.parse(localStorage.getItem("orders")) || []
  );


  const updateStatus = (index, status) => {

    const updatedOrders = orders.map((order, i) =>
      i === index
        ? { ...order, status }
        : order
    );

    setOrders(updatedOrders);

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );

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
              key={index}
              className="bg-white shadow-md rounded-xl p-6"
            >


              <h2 className="text-xl font-bold">
                Customer: {order.customerName || "Unknown"}
              </h2>


              <p>
                Email: {order.customerEmail || "No email"}
              </p>


              <p>
                Address: {order.address || "No address"}
              </p>


              <p>
                Date: {order.date || "Unknown"}
              </p>



              <h3 className="font-bold mt-4">
                Products:
              </h3>


              {Array.isArray(order.products) ? (

                order.products.map((product) => (

                  <p key={product.id}>

                    {
                      typeof product.name === "object"
                        ? product.name.en
                        : product.name
                    }

                    {" x "}

                    {product.quantity || 1}

                  </p>

                ))

              ) : (

                <p>No products</p>

              )}



              <h2 className="text-xl font-bold mt-4">
                Total: {order.total} TND
              </h2>



              <p className="mt-3">
                Status:
                <span className="font-bold ml-2">
                  {order.status || "Pending ⏳"}
                </span>
              </p>



              <div className="flex gap-3 mt-4">


                <button
                  onClick={() =>
                    updateStatus(index, "Pending ⏳")
                  }
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                >
                  Pending
                </button>



                <button
                  onClick={() =>
                    updateStatus(index, "Shipped 🚚")
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Shipped
                </button>



                <button
                  onClick={() =>
                    updateStatus(index, "Delivered ✅")
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Delivered
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