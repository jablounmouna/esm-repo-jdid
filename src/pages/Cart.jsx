import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Cart({ cart, removeFromCart, increaseQuantity, decreaseQuantity }) {

  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity || 1),
    0
  );

  const getProductName = (item) => {
    if (typeof item.name === "object") {
      return item.name[i18n.language] || item.name.en;
    }

    return item.name;
  };


  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        🛒 Your Cart
      </h1>


      {cart.length === 0 ? (

        <h2 className="text-gray-500 text-center mt-10">
          Cart is empty
        </h2>

      ) : (

        <div className="flex flex-col gap-4">

          {cart.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-4 flex gap-4 items-center"
            >

              <img
                src={item.image}
                alt={getProductName(item)}
                className="w-24 h-24 object-cover rounded-lg"
              />


              <div className="flex-1">

                <h2 className="text-lg font-semibold text-gray-800">
                  {getProductName(item)}
                </h2>


                <p className="text-gray-500">
                  {item.price} TND
                </p>


                <div className="flex items-center gap-3 mt-2">

                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    -
                  </button>


                  <span className="w-6 text-center font-medium">
                    {item.quantity}
                  </span>


                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    +
                  </button>


                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    Delete 🗑️
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}



      {cart.length > 0 && (

        <div className="mt-8 flex items-center justify-between border-t pt-6">

          <h2 className="text-xl font-bold text-gray-800">
            Total: {total.toFixed(2)} TND
          </h2>


          <button
            onClick={() => navigate("/checkout")}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Checkout 💳
          </button>

        </div>

      )}

    </div>
  );
}

export default Cart;