import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../api";

function Checkout({ cart, setCart }) {

  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");


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

  const selectedProduct = location.state?.product;

  const checkoutItems = cart.length > 0
    ? cart
    : selectedProduct
      ? [{ ...selectedProduct, quantity: Number(selectedProduct.quantity || 1) }]
      : [];

  const total = checkoutItems.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity || 1),
    0
  );





  const handleOrder = async () => {


    if (!phone.trim()) {

      alert("Phone number is required ❌");
      return;

    }



    if (!address.trim()) {

      alert("Delivery address is required ❌");
      return;

    }



    try {
      console.log("CART SENT:", JSON.stringify(checkoutItems, null, 2));

      const data = await apiFetch("/create_order.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          total: total,
          address: address.trim(),
          phone: phone.trim(),
          products: checkoutItems,
        }),
      });

      console.log("ORDER:", data);





      if (data.success) {


        setCart([]);

        setAddress("");

        setPhone("");


        alert("Order confirmed ✅");


        navigate("/profile");



      } else {


        alert(data.message);


      }



    } catch(error) {


      console.log("ORDER ERROR:", error);

      alert("Server error ❌");


    }


  };






  return (

    <div className="p-6">


      <h1 className="text-2xl font-bold mb-6">
        Checkout 💳
      </h1>

      {checkoutItems.length === 0 ? (
        <h2 className="text-black text-center mt-10">
          Your cart is empty
        </h2>



      ) : (


        <div className="bg-white rounded-xl shadow-md p-6">



          <div className="mb-4 space-y-2">
            {checkoutItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span>
                  {getProductName(item)} × {item.quantity}
                </span>
                <span className="font-semibold">
                  {(Number(item.price) * Number(item.quantity || 1)).toFixed(2)} TND
                </span>
              </div>
            ))}
          </div>





          <h2 className="text-xl font-bold border-t pt-4">

            Total: {total.toFixed(2)} TND

          </h2>





          <label className="mt-4 block font-bold">

            Delivery address

            <span className="text-red-500"> *</span>

          </label>



          <input

            type="text"

            placeholder="Enter your address"

            value={address}

            onChange={(e)=>setAddress(e.target.value)}

            className="w-full mt-2 px-4 py-2 border rounded-lg"

          />







          <label className="mt-4 block font-bold">

            Phone number

            <span className="text-red-500"> *</span>

          </label>



          <input

            type="text"

            placeholder="Enter your phone number"

            value={phone}

            onChange={(e)=>setPhone(e.target.value)}

            className="w-full mt-2 px-4 py-2 border rounded-lg"

          />







          <button

            onClick={handleOrder}

            className="w-full mt-5 bg-black text-white py-3 rounded-lg hover:bg-gray-800"

          >

            Confirm Order ✅

          </button>



        </div>


      )}



    </div>


  );

}


export default Checkout;