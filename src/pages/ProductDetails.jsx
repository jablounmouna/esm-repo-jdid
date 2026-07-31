import { useParams, useNavigate } from "react-router-dom";

function ProductDetails({ products, addToCart }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-700">
          Product not found ❌
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
       <img
  src={product.image}
  alt={product.name}
  className="w-full md:w-1/2 h-80 md:h-auto object-cover"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/400x400?text=No+Image";
  }}
/>
        <div className="p-8 flex flex-col flex-1">
          <h1 className="text-2xl font-bold text-gray-800">
            {product.name}
          </h1>
          <h2 className="text-xl text-gray-600 mt-2">
            {product.price} TND
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Category: {product.category || "Handmade"}
          </p>

          <p className="text-gray-600 mt-4 leading-relaxed">
            Beautiful handmade product, created with care and quality
            materials.
          </p>

          <div className="mt-auto pt-6 flex gap-4">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Add to Cart 🛒
            </button>

            <button
              onClick={() => {
                addToCart(product);
                navigate("/checkout");
              }}
              className="flex-1 bg-amber-500 text-white py-3 rounded-lg hover:bg-amber-600 transition"
            >
              Buy Now ⚡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;