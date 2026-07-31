import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function Checkout({ cart, setCart }) {

  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [address, setAddress] = useState("");


  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);


  if (!user) {
    return null;
  }


  const getProductName = (item) => {
    if (typeof item.name === "object") {
      return item.name[i18n.language] || item.name.en;
    }

    return item.name;
  };


  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity || 1),
    0
  );


 const handleOrder = async () => {

  if (!address.trim()) {
    alert("Please enter a delivery address ❌");
    return;
  }


  try {

    const response = await fetch(
      "http://127.0.0.1:8001/api/create_order.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user.email,
          total: total,
          address: address.trim()
        })
      }
    );


    const data = await response.json();


    if (data.success) {

      setCart([]);
      setAddress("");

      alert("Order confirmed ✅");

      navigate("/profile");

    } else {

      alert(data.message);

    }


  } catch (error) {

    console.log(error);
    alert("Server error ❌");

  }

};

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Checkout 💳
      </h1>


      {cart.length === 0 ? (

        <h2 className="text-black text-center mt-10">
          Your cart is empty
        </h2>


      ) : (


        <div className="bg-white rounded-xl shadow-md p-6">


          <div className="flex flex-col gap-2 mb-4">

            {cart.map((item) => (

              <p
                key={item.id}
                className="text-black"
              >
                {getProductName(item)} x {item.quantity}
              </p>

            ))}

          </div>



          <h2 className="text-xl font-bold text-black border-t pt-4">

            Total: {total.toFixed(2)} TND

          </h2>



          <input

            placeholder="Delivery address"

            value={address}

            onChange={(e) =>
              setAddress(e.target.value)
            }

            className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"

          />



          <button

            onClick={handleOrder}

            className="w-full mt-4 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"

          >

            Confirm Order ✅

          </button>



        </div>

      )}

    </div>

  );

}


export default Checkout;