import { useTranslation } from "react-i18next";

function Wishlist({ wishlist, toggleWishlist }) {

  const { i18n } = useTranslation();


  const getName = (product) => {
    if (typeof product.name === "object") {
      return product.name[i18n.language] || product.name.en;
    }

    return product.name;
  };


  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Your Wishlist ❤️
      </h1>


      {wishlist.length === 0 ? (

        <p className="text-gray-500">
          Your wishlist is empty 😢
        </p>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">


          {wishlist.map((product) => (

            <div
              key={product.id}
              className="bg-white shadow rounded-xl p-4"
            >

              <img
                src={product.image}
                alt={getName(product)}
                className="h-40 w-full object-cover rounded"
              />


              <h3 className="mt-3 font-semibold">
                {getName(product)}
              </h3>


              <p className="text-gray-600">
                {product.price} TND
              </p>


              <button
                onClick={() => toggleWishlist(product)}
                className="mt-3 w-full bg-red-500 text-white py-2 rounded"
              >
                Remove ❌
              </button>


            </div>

          ))}


        </div>

      )}

    </div>
  );
}

export default Wishlist;