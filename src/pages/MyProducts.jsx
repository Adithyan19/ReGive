import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function MyProducts({ products, setProducts }) {
  const { fetchWithAuth } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedProduct(null);
      }
    };
    if (selectedProduct) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedProduct]);

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetchWithAuth(`${BACKEND_URL}/api/item/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p._id !== id));
        setSelectedProduct(null);
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">My Products</h2>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-gray-100 rounded-lg cursor-pointer overflow-hidden shadow hover:shadow-lg transition"
              onClick={() => setSelectedProduct(product)}
            >
              <img
                src={`${BACKEND_URL}${product.imageURL[0] || "/placeholder.png"}`}
                alt={product.name}
                className="w-full h-32 object-cover"
              />
              <div className="p-2 text-center font-medium">{product.name}</div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-xl"
              onClick={() => setSelectedProduct(null)}
            >
              &times;
            </button>
            <img
              src={`${BACKEND_URL}${selectedProduct.imageURL[0] || "/placeholder.png"}`}
              alt={selectedProduct.name}
              className="w-full h-64 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold">{selectedProduct.name}</h3>
            <p className="mt-2">{selectedProduct.description}</p>
            <p className="mt-1">
              <strong>Condition:</strong> {selectedProduct.condition}
            </p>
            <p className="mt-1">
              <strong>Status:</strong> {selectedProduct.status}
            </p>
            <p className="mt-1">
              <strong>Pickup:</strong> {selectedProduct.pickup}
            </p>
            <p className="mt-1">
              <strong>Available until:</strong>{" "}
              {new Date(selectedProduct.available_until).toLocaleDateString()}
            </p>

            <button
              onClick={() => handleDeleteProduct(selectedProduct._id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
