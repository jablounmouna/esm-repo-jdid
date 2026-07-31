import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function Home({ products, addToCart, toggleWishlist, wishlist }) {

  const [search, setSearch] = useState("");

  const { i18n } = useTranslation();


  const getProductName = (product) => {
    if (typeof product.name === "object") {
      return product.name[i18n.language] || product.name.en;
    }

    return product.name;
  };


  const filteredProducts = products.filter((product) => {

    const name = getProductName(product);

    return name
      ?.toLowerCase()
      .includes(search.toLowerCase());

  });


  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Products 🛍️
      </h1>


      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-96 px-4 py-3 mb-8 border border-gray-300 rounded-lg"
      />


      {filteredProducts.length > 0 ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">


          {filteredProducts.map((product) => {

            const isInWishlist = wishlist.some(
              (item) => item.id === product.id
            );


            return (

              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
              >


                {/* Image + Wishlist */}

                <div className="relative">

                  <img
                    src={product.image}
                    alt={getProductName(product)}
                    className="w-full h-48 object-cover"

                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/400x400?text=No+Image";
                    }}
                  />


                  <button
                    onClick={() => toggleWishlist(product)}
                    className="wishlist-btn absolute top-2 right-2 text-2xl"
                  >
                    {isInWishlist ? "❤️" : "🤍"}
                  </button>


                </div>



                <div className="p-4 flex flex-col flex-grow">


                  <h3 className="font-semibold text-lg">
                    {getProductName(product)}
                  </h3>


                  <p className="text-gray-600 mb-4">
                    {product.price} TND
                  </p>



                  <button
                    onClick={() => addToCart(product)}
                    className="mt-auto w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                  >
                    Add to Cart 🛒
                  </button>


                </div>


              </div>

            );

          })}


        </div>


      ) : (


        <p className="text-gray-500 text-center mt-10">
          No products match "{search}"
        </p>


      )}


    </div>

  );
}


export default Home;