import { useState } from "react";

export default function ItemGrid({ items }) {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div>
      {/* Grid of small cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-md overflow-hidden cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setSelectedItem(item)}
          >
            <img
              src={item.imageURL[0] || "/placeholder.png"}
              alt={item.name}
              className="w-full h-32 object-cover"
            />
            <div className="p-2 text-center font-medium">{item.name}</div>
          </div>
        ))}
      </div>

      {/* Modal for selected item */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 overflow-y-auto max-h-[90vh] relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedItem(null)}
            >
              ✕
            </button>

            <img
              src={selectedItem.imageURL[0] || "/placeholder.png"}
              alt={selectedItem.name}
              className="w-full h-64 object-cover rounded-t-lg"
            />

            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{selectedItem.name}</h2>
              <p className="mb-2">{selectedItem.description}</p>
              <p className="mb-2">
                <strong>Condition:</strong> {selectedItem.condition}
              </p>
              <p className="mb-2">
                <strong>Pickup:</strong> {selectedItem.pickup}
              </p>
              {selectedItem.price > 0 && (
                <p className="mb-2">
                  <strong>Price:</strong> ${selectedItem.price}
                </p>
              )}
              <p className="mb-2">
                <strong>Status:</strong> {selectedItem.status}
              </p>
              <p className="mb-2">
                <strong>Category:</strong> {selectedItem.categoryId.name || selectedItem.categoryId}
              </p>
              <p className="mb-2">
                <strong>Preferences:</strong> {selectedItem.preferences.join(", ")}
              </p>
              {selectedItem.available_until && (
                <p className="mb-2">
                  <strong>Available Until:</strong>{" "}
                  {new Date(selectedItem.available_until).toLocaleDateString()}
                </p>
              )}
              {selectedItem.urgent && <p className="text-red-500 font-semibold">Urgent</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
